'use strict';

var parser = require('htmlparser')
  , EventEmitter = require('events').EventEmitter
  , events = new EventEmitter()
  , helpers = require('./helpers')
  , htmlparser
  , previous;

/**
 * Parse traversable DOM to content.
 *
 * @param {Object} error
 * @param {Object} dom presented as traversable object
 * @api private
 */
function minifier (error, dom) {
  if (error) throw new Error('Minifier failed to parse DOM', error);

  // DOM has been completely parsed, emit the results.
  events.emit('parsed', traverse(dom, ''));
}

function traverse (data, html) {
  return data.reduce(walk, html);
}

function walk (data, element) {
  data += helpers.map[element.type](element, previous);
  previous = element;

  return (element.children
    ? traverse(element.children, data)
    : data) + helpers.close(element);
}

/**
 * Expose the minimizer.
 *
 * @param {String} content HTML
 * @param {Function} callback
 * @api public
 */
function minimize (content, callback) {
  if (typeof callback !== 'function') throw new Error('No callback provided');

  // Setup the default parser to ignore whitespace.
  htmlparser = new parser.Parser(
    new parser.DefaultHandler(minifier, { ignoreWhitespace: true })
  );

  // Listen to dom parsing as the
  events.on('parsed', callback);

  // Parse the HTML.
  htmlparser.parseComplete(content);
}

/**
 * Expose the minimize function as default.
 */
module.exports = minimize;

/**
 * Expose some additional modules while testing.
 */
if (process.env.NODE_ENV === 'test') {
  module.exports = {
      minimize: minimize
    , helpers: helpers
  };
}
