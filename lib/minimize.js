'use strict';

//
// Required modules.
//
var EventEmitter = require('events').EventEmitter
  , debug = require('diagnostics')('minimize')
  , Helpers = require('./helpers')
  , html = require('htmlparser2')
  , uuid = require('uuid')
  , emits = require('emits')
  , async = require('async')
  , util = require('util');

/**
 * Minimizer constructor.
 *
 * @Constructor
 * @param {Function} parser HTMLParser2 instance, i.e. to support SVG if required.
 * @param {Object} options parsing options, optional
 * @api public
 */
function Minimize(parser, options) {
  if ('object' !== typeof options) {
    options = parser || {};
    options.dom = options.dom || {};
    parser = void 0;
  }

  this.emits = emits;
  this.plugins = Object.create(null);
  this.helpers = new Helpers(options);

  //
  // Prepare the parser.
  //
  this.htmlparser = parser || new html.Parser(
    new html.DomHandler(this.emits('read')),
    options.dom
  );

  //
  // Register plugins.
  //
  this.plug(options.plugins);
}

//
// Add EventEmitter prototype.
//
util.inherits(Minimize, EventEmitter);

/**
 * Start parsing the provided content and call the callback.
 *
 * @param {String} content HTML
 * @param {Function} callback
 * @api public
 */
Minimize.prototype.parse = function parse(content, callback) {
  var minimize = this
    , id = uuid.v4()
    , sync = false
    , output;

  if (typeof callback !== 'function') {
    sync = true;

    callback = function parsed(error, result) {
      if (error) {
        minimize.emit('error', error);
      }

      output = result;
    }
  }

  //
  // Listen to DOM parsing, so the htmlparser callback can trigger it.
  //
  this.once('read', this.minifier.bind(this, id, sync));
  this.once('parsed:' + id, callback);

  //
  // Initiate parsing of HTML.
  //
  this.htmlparser.parseComplete(content);

  //
  // Return content if generated synchronously otherwise undefined.
  //
  return output;
};

/**
 * Parse traversable DOM to content.
 *
 * @param {Object} error
 * @param {Object} dom presented as traversable object
 * @returns {Void}
 * @api private
 */
Minimize.prototype.minifier = function minifier(id, sync, error, dom) {
  if (error) throw new Error('Minifier failed to parse DOM', error);

  //
  // DOM has been completely parsed, emit the results.
  //
  return this.traverse(dom, '', sync, this.emits('parsed:' + id));
};

/**
 * Traverse the data object, reduce data to string.
 *
 * @param {Array} data
 * @param {String} html compiled contents.
 * @param {Function} done Completion callback.
 * @return {String} completed HTML
 * @api private
 */
Minimize.prototype.traverse = function traverse(data, html, sync, done) {
  var minimize = this
    , plugins = Object.keys(this.plugins);

  //
  // Ensure data can be reduced.
  //
  data = data || [];

  /**
   * (A)synchronously return or callback with HTML.
   *
   * @param {Error} error Runtime error
   * @param {String} html minimized HTML
   * @param {Function} cb optional callback
   * @returns {String} HTML
   * @api private
   */
  function returns(error, html, cb) {
    var fn = typeof cb === 'function';

    if (error) {
      debug('Error received: %s', error.message);

      if (fn) cb(error);
      return minimize.emit('error', error);
    }

    if (fn) return cb(null, html);
    return html;
  }

  /**
   * For all children run same iterator.
   *
   * @param {Object} element Current element
   * @param {String} content Current minimized HTML, memo.
   * @param {Function} next Completion callback.
   * @returns {Function} Runner.
   * @api private
   */
  function traverser(element, content, next) {
    return function () {
      return minimize.traverse(element.children, content, sync, step(element, 'close', next))
    };
  }

  /**
   * Minimize single level of HTML.
   *
   * @param {Object} element Properties
   * @param {String} type Element type
   * @param {Function} cb Completion callback
   * @api private
   */
  function step(element, type, cb) {
    return function generate(error, html) {
      html += minimize.helpers[type](element);
      return returns(error, html, cb);
    }
  }

  /**
   * Traverse children of current element.
   *
   * @param {Object} element Properties
   * @param {Function} cb Completion callback
   * @api private
   */
  function run(element, cb) {
    return function level(error, content) {
      debug('Traversing children of element %s', element.name);

      if (sync) {
        return traverser(element, content, cb)();
      }

      setImmediate(traverser(element, content, cb));
    }
  }

  /**
   * Create opening string of element.
   *
   * @param {Object} element Properties
   * @param {String} html Current minimized HTML, memo.
   * @param {Function} cb Completion callback
   * @returns {String} Result
   * @api private
   */
  function open(element, html, cb) {
    return step(element, 'open', cb)(null, html);
  }

  /**
   * Create plugins for element.
   *
   * @param {Object} element Properties.
   * @return {Function} Plugin function to run.
   * @api private
   */
  function createPlug(element) {
    return function plug(plugin, fn) {
      fn = fn || minimize.emits('plugin');

      debug('Running plugin for element %s', element.name);
      minimize.plugins[plugin].element.call(minimize, element, fn);
    }
  }

  /**
   * Reduce each HTML element and its children.
   *
   * @param {String} html Current compiled HTML, memo.
   * @param {Object} element Current element.
   * @param {Function} step Completion callback
   * @returns {String} minimized HTML.
   * @api private
   */
  function reduce(html, element, next) {
    //
    // Run the registered plugins before the element is processed.
    // Note that the plugins are not run in order.
    //
    if (sync) {
      plugins.forEach(createPlug(element));
      return open(element, html, run(element, next));
    }

    async.eachSeries(plugins, createPlug(element), function finished(error) {
      if (error) return next(error);
      return open(element, html, run(element, next));
    });
  }

  //
  // Reduce all provided elements to minimized HTML.
  //
  if (sync) {
    debug('Synchronously reducing %d parsed HTML elements', data.length);
    return done(null, data.reduce(reduce, html));
  }

  debug('Asynchronously reducing %d parsed HTML elements', data.length);
  return async.reduce(data, html, reduce, done);
};

/**
 * Register provided plugins.
 *
 * @param {Array} plugins Collection of plugins
 * @api private
 */
Minimize.prototype.plug = function plug(plugins) {
  if (!Array.isArray(plugins)) return;
  var minimize = this;

  plugins.forEach(function each(plugin) {
    minimize.use(plugin);
  });
};

/**
 * Register a new plugin.
 *
 * ```js
 * minimize.use('dropClass', {
 *   element: function () { }
 * });
 * ```
 *
 * @param {String} id The id of the plugin.
 * @param {Object} plugin The plugin module.
 * @api public
 */
Minimize.prototype.use = function use(id, plugin) {
  if ('object' === typeof id) {
    plugin = id;
    id = plugin.id;
  }

  if (!id) throw new Error('Plugin should be specified with an id.');
  if ('string' !== typeof id) throw new Error('Plugin id should be a string.');
  if ('string' === typeof plugin) plugin = require(plugin);

  //
  // Plugin accepts an object or a function only.
  //
  if (!/^(object|function)$/.test(typeof plugin)) {
    throw new Error('Plugin should be an object or function.');
  }

  //
  // Plugin requires an element method to be specified.
  //
  if ('function' !== typeof plugin.element) {
    throw new Error('The plugin is missing an element method to execute.');
  }

  if (id in this.plugins) {
    throw new Error('The plugin name was already defined.');
  }

  debug('Added plugin `%s`', id);

  this.plugins[id] = plugin;
  return this;
};

//
// Expose the minimize function by default.
//
module.exports = Minimize;