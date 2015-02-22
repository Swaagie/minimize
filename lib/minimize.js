'use strict';

//
// Required modules.
//
var html = require('htmlparser2')
  , EventEmitter = require('events').EventEmitter
  , Helpers = require('./helpers');

/**
 * Minimizer constructor.
 *
 * @Constructor
 * @param {Object} options parsing options, optional
 * @api public
 */
function Minimize(options) {
  options = options || {};

  this.helpers = new Helpers(options);
  this.plugins = Object.create(null);

  //
  // Prepare the parser.
  //
  this.htmlparser = new html.Parser(
    new html.DomHandler(this.minifier.bind(this))
  );

  //
  // Register plugins.
  //
  this.plug(options.plugins);
}

//
// Add EventEmitter prototype.
//
require('util').inherits(Minimize, EventEmitter);

/**
 * Start parsing the provided content and call the callback.
 *
 * @param {String} content HTML
 * @param {Function} callback
 * @api public
 */
Minimize.prototype.parse = function parse(content, callback) {
  if (typeof callback !== 'function') throw new Error('No callback provided');

  //
  // Listen to DOM parsing, so the htmlparser callback can trigger it.
  //
  this.once('parsed', callback);

  //
  // Initiate parsing of HTML.
  //
  this.htmlparser.parseComplete(content);
};

/**
 * Parse traversable DOM to content.
 *
 * @param {Object} error
 * @param {Object} dom presented as traversable object
 * @api private
 */
Minimize.prototype.minifier = function minifier(error, dom) {
  if (error) throw new Error('Minifier failed to parse DOM', error);

  //
  // DOM has been completely parsed, emit the results.
  //
  this.emit('parsed', error, this.traverse(dom, ''));
};

/**
 * Traverse the data object, reduce data to string.
 *
 * @param {Array} data
 * @param {String} html compiled contents.
 * @return {String} completed HTML
 * @api private
 */
Minimize.prototype.traverse = function traverse(data, html) {
  return data.reduce(this.walk.bind(this), html);
};

/**
 * Walk the provided DOM, reduce helper.
 *
 * @param {String} data compiled contents.
 * @param {Object} element
 * @return {String}
 * @api private
 */
Minimize.prototype.walk = function walk(html, element) {
  html += this.helpers[element.type](element, html);

  return (element.children
    ? this.traverse(element.children, html)
    : html) + this.helpers.close(element);
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
 * bigpipe.use('dropClass', {
 *   element: function () { }
 * });
 * ```
 *
 * @param {String} name The name of the plugin.
 * @param {Object} plugin The plugin module.
 * @api public
 */
Minimize.prototype.use = function use(name, plugin) {
  if ('object' === typeof name) {
    plugin = name;
    name = plugin.name;
  }

  if (!name) throw new Error('Plugin should be specified with a name.');
  if ('string' !== typeof name) throw new Error('Plugin names should be a string.');
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
    throw new Error('The plugin in missing methods to execute.');
  }

  if (name in this._plugins) {
    throw new Error('The plugin name was already defined.');
  }

  debug('Added plugin `%s`', name);

  this.plugins[name] = plugin;
  return this;
};

//
// Expose the minimize function by default.
//
module.exports = Minimize;
