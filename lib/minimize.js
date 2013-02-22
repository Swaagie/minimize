'use strict';

var parser = require('htmlparser')
  , EventEmitter = require('events').EventEmitter
  , events = new EventEmitter()
  , htmlparser;

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
  data += '<' + element.data + '>';

  return element.children
    ? traverse(element.children, data)
    : data;
}

/**
 * Expose the minimizer.
 *
 * @param {String} content HTML
 * @param {Function} callback
 * @api public
 */
module.exports = function minimize (content, callback) {
  // Setup the default parser to ignore whitespace.
  htmlparser = new parser.Parser(
    new parser.DefaultHandler(minifier, { ignoreWhitespace: true })
  );

  // Listen to dom parsing as the
  events.on('parsed', callback);

  // Parse the HTML.
  htmlparser.parseComplete(content);
};
