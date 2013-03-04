'use strict';

/**
 * Required modules.
 */
var util = require('utile');

/**
 * Some predefined elements and regular expressions.
 */
var flow = /<\/[^>]+>$|\w+$/
  , inline = [
        'a', 'abbr', 'acronym', 'b', 'bdo', 'big', 'br', 'button', 'cite'
      , 'code', 'dfn', 'em', 'i', 'img', 'input', 'kbd', 'label', 'map'
      , 'object', 'q', 'samp', 'script', 'select', 'small', 'span', 'strong'
      , 'sub', 'sup', 'textarea', 'tt', 'var'
    ]
  , singular = [
        'area', 'base', 'br', 'col', 'command', 'embed', 'hr'
      , 'img', 'input', 'link', 'meta', 'param', 'source'
    ]
  , node = /tag|script/
  , structural = /pre|textarea/
  , interpunction = /[\.,!%;:\-\?]/;

/**
 * Predefined parsing options.
 */
var config = {
    empty: false // remove empty attributes
  , cdata: false // strip CDATA from scripts
  , comments: false // remove comments
  , spare: false // remove redundant attributes
};

/**
 * Helper constructor.
 *
 * @Constructor
 * @param {Object} options
 * @api public
 */
function Helpers (options) {
  if (options) config = util.mixin(config, options);
}

/**
 * Is an element inline or not.
 *
 * @param {Object} element
 * @return {Boolean}
 * @api private
 */
Helpers.prototype.isInline = function isInline (element) {
  return !!~inline.indexOf(element.name);
};

/**
 * Create starting tag for element, if required an additional white space will
 * be added to retain flow of inline elements.
 *
 * @param {Object} element
 * @return {String}
 * @api public
 */
Helpers.prototype.tag = function tag (element, ancestor, data) {
  return (this.isInline(element) && (flow.test(data) || interpunction.test(data))
    ? ' <'
    : '<') + element.data + '>';
};

/**
 * Provide closing tag for element if required.
 *
 * @param {Object} element
 * @return {String}
 * @api public
 */
Helpers.prototype.close = function close (element) {
  return node.test(element.type) && !~singular.indexOf(element.name)
    ? '</' + element.name + '>'
    : '';
};

/**
 * Check the script is actual script or abused for template/config. Scripts
 * without attribute type or type="text/javascript" are JS elements by default.
 *
 * @param {Object} element
 * @return {Boolean}
 * @api private
 */
Helpers.prototype.isJS = function isJS (element) {
  return element.type === 'script'
    && !/script.*?type\s*=\s*.(?!text\/javascript).*/i.test(element.data);
};

/**
 * Check if an element needs to retain its internal structure, e.g. this goes
 * for elements like script, textarea or pre.
 *
 * @param {Object} element
 * @return {Boolean}
 * @api private
 */
Helpers.prototype.structure = function structure (element) {
  return element.type !== 'text'
    ? structural.test(element.name) || this.isJS(element)
    : false;
};

/**
 * Return trimmed text, if text requires no structure new lines and spaces will
 * be replaced with a single white space. If the element is preluded by an inline
 * element a white space is added.
 *
 * @param {Object} element
 * @param {Object} ancestor wrapping parent
 * @param {String} data minified content
 * @return {String} text
 * @api public
 */
Helpers.prototype.text = function text (element, ancestor, data) {
  element = element.data.trim();

  if (!this.structure(ancestor)) element = element.replace(/\n/g, '').replace(/\s+/g, ' ');
  if (flow.test(data) && !(new RegExp('^' + interpunction.source)).test(element)) {
    element = ' ' + element;
  }

  return element;
};

/**
 * Returned parsed comment or empty string if config.comments = true.
 *
 * @param {Object} element
 * @return {String} comment
 * @api public
 */
Helpers.prototype.comment = function comment (element) {
  return !config.comments ? '' : '<!--' + element.data + '-->';
};

/**
 * Define some proxies for easy external reference.
 */
Helpers.prototype.directive = Helpers.prototype.tag;
Helpers.prototype.script = Helpers.prototype.tag;

/**
 * Expose some additional members while testing.
 */
if (process.env.NODE_ENV === 'test') {
  Helpers.prototype.flow = flow;
  Helpers.prototype.node = node;
  Helpers.prototype.structural = structural;
  Helpers.prototype.inline = inline;
  Helpers.prototype.singular = singular;
  Helpers.prototype.interpunction = interpunction;
  Helpers.prototype.config = config;
}

/**
 * Create public proxies.
 */
module.exports = Helpers;
