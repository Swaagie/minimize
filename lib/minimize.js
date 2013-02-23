'use strict';

var parser = require('htmlparser')
  , EventEmitter = require('events').EventEmitter
  , events = new EventEmitter()
  , helpers = require('./helpers')
  , htmlparser;

/**
 * Parse traversable DOM to content.
 *
 * @param {Object} error
 * @param {Object} dom presented as traversable object
 * @api private
 */
var children = []
  , count = [];
function minifier (error, dom) {
  if (error) throw new Error('Minifier failed to parse DOM', error);

  // DOM has been completely parsed, emit the results.
  events.emit('parsed', traverse(dom, ''));
  console.log(children, count);
}

function traverse (data, html) {
  return data.reduce(walk, html);
}

function walk (data, element, index, input) {
  var last;
  if (!!element.children) {
    children.push(element.name);
    count.push(element.children.length);
  }

  data += helpers.map[element.type](element.data);

  if (children.length) {
    last = count.length - 1;

    if (!count[last]) data += helpers.map.tag(children[last], true);

    if (--count[last] < 0) {
      children.pop();
      count.pop();
    }
  }

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
  if (typeof callback !== 'function') throw new Error('No callback provided');

  // Setup the default parser to ignore whitespace.
  htmlparser = new parser.Parser(
    new parser.DefaultHandler(minifier, { ignoreWhitespace: true })
  );

  // Listen to dom parsing as the
  events.on('parsed', callback);

  // Parse the HTML.
  htmlparser.parseComplete(content);
};
