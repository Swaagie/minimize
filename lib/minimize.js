'use strict';

var parser = require('htmlparser')
  , EventEmitter = require('events').EventEmitter
  , events = new EventEmitter()
  , Helpers = require('./helpers')
  , helpers = new Helpers()
  , htmlparser
  , ancestor;

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

/**
 * Traverse the data object, reduce data to string.
 *
 * @param {Array} data
 * @param {String} html compiled contents.
 * @return {String} completed HTML
 * @api private
 */
function traverse (data, html) {
  return data.reduce(walk, html);
}

/**
 * Walk the provided DOM, reduce helper.
 *
 * @param {String} data compiled contents.
 * @param {Object} element
 * @return {String}
 * @api private
 */
function walk (html, element) {
  html += helpers[element.type](element, ancestor, html);

  // Store reference to ancestor.
  if (element.children) ancestor = element;

  return (element.children
    ? traverse(element.children, html)
    : html) + helpers.close(element);
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
 * Expose the minimize function by default.
 */
module.exports = minimize;

/**
 * Expose some additional modules while testing.
 */
if (process.env.NODE_ENV === 'test') {
  helpers = new Helpers.constructor();
  module.exports = {
      minimize: minimize
    , helpers: helpers
    , walk: walk
    , traverse: traverse
    , minifier: minifier
  };
}
