'use strict';

//
// Required modules.
//
var util = require('utile');

//
// Some predefined elements and regular expressions.
//
var conditional = /\[if.+IE[\s\d]*\]>.+<\!\[endif\]/g
  , inline = [
      'a', 'abbr', 'b', 'bdo', 'cite',
      'code', 'dfn', 'em', 'i', 'img', 'kbd',
      'q', 's', 'samp', 'small', 'span', 'strong',
      'sub', 'sup', 'textarea', 'var',
    ]
  , singular = [
      'area', 'base', 'br', 'col', 'command', 'embed', 'hr',
      'img', 'input', 'link', 'meta', 'param', 'source',
    ]
  , redundant = [
      'autofocus', 'disabled', 'multiple', 'required', 'readonly', 'hidden',
      'async', 'defer', 'formnovalidate', 'checked', 'scoped', 'reversed',
      'selected', 'autoplay', 'controls', 'loop', 'muted', 'seamless',
      'default', 'ismap', 'novalidate', 'open', 'typemustmatch', 'truespeed',
      'itemscope'
    ]
  , node = [ 'tag', 'script', 'style' ]
  , structural = [ 'pre', 'textarea', 'code' ]
  , retain = /data|itemscope/
  , cdata = {
      start: /\/*<!\[CDATA\[/g,
      end: /\/*\]\]>/g
    };

//
// Predefined parsing options.
//
var config = {
  empty: false,        // remove(false) or retain(true) empty attributes
  cdata: false,        // remove(false) or retain(true) CDATA from scripts
  comments: false,     // remove(false) or retain(true) comments
  conditionals: false, // remove(false) or retain(true) ie conditional comments
  spare: false,        // remove(false) or retain(true) redundant attributes
  quotes: false        // remove(false) or retain(true) quotes if not required
};

/**
 * Helper constructor.
 *
 * @Constructor
 * @param {Object} options
 * @api public
 */
function Helpers(options) {
  this.config = util.mixin(util.clone(config), options || {});

  this.ancestor = [];
}

/**
 * Wraps the attribute in quotes, or anything that needs them.
 *
 * @param {String} value
 * @return {String}
 * @api public
 */
Helpers.prototype.quote = function quote(value) {
  //
  // Quote is only called if required so it's safe to return quotes on no value.
  //
  if (!value) return '""';

  //
  // Always quote attributes having spaces or ending in a slash.
  //
  return value.slice(-1) === '/' || (/[\s=]+/).test(value) || this.config.quotes
    ? '"' + value + '"'
    : value;
};

/**
 * Is an element inline or not.
 *
 * @param {Object} element
 * @return {Boolean}
 * @api private
 */
Helpers.prototype.isInline = function isInline(element) {
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
Helpers.prototype.tag = function tag(element, data) {
  //
  // Check if the current element requires structure, store for later reference.
  //
  if (this.structure(element)) this.ancestor.push(element);

  return '<' + element.name + this.attributes(element) + '>';
};

/**
 * Loop set of attributes belonging to an element. Surrounds attributes with
 * quotes if required, omits if not.
 *
 * @param {Object} element element containing attributes
 * @return {String}
 * @api public
 */
Helpers.prototype.attributes = function attributes(element) {
  var attr = element.attribs
    , self = this
    , value, bool;

  if (!attr || typeof attr !== 'object') return '';

  return Object.keys(attr).reduce(function (result, key) {
    value = attr[key];
    bool = ~redundant.indexOf(key);

    //
    // Remove attributes that are empty, not boolean and no semantic value.
    //
    if (!self.config.empty && !retain.test(key) && !bool && !value) return result;
    //
    // Boolean attributes should be added sparse.
    //
    if (!self.config.spare && bool) return result + ' ' + key;
    //
    // Return full attribute with value.
    //
    return result + ' ' + key + '=' + self.quote(value);
  }, '');
};

/**
 * Provide closing tag for element if required.
 *
 * @param {Object} element
 * @return {String}
 * @api public
 */
Helpers.prototype.close = function close(element) {
  if (this.structure(element)) this.ancestor.pop();

  return ~node.indexOf(element.type) && !~singular.indexOf(element.name)
    ? '</' + element.name + '>'
    : '';
};

/**
 * Check the script is actual script or abused for template/config. Scripts
 * without attribute type or type="text/javascript" are JS elements by default.
 *
 * @param {Object} element
 * @return {Boolean}
 * @api public
 */
Helpers.prototype.isJS = function isJS(element) {
  return (element.type === 'script' && (!element.attribs || !element.attribs.type))
    || (element.type === 'script' && element.attribs.type === 'text/javascript');
};

/**
 * Check if the element is of type style.
 *
 * @param {Object} element
 * @return {Boolean}
 * @api public
 */
Helpers.prototype.isStyle = function isStyle(element) {
  return element.type === 'style';
};

/**
 * Check if an element needs to retain its internal structure, e.g. this goes
 * for elements like script, style, textarea or pre.
 *
 * @param {Object} element
 * @return {Boolean}
 * @api public
 */
Helpers.prototype.structure = function structure(element) {
  return element.type !== 'text'
    ? !!~structural.indexOf(element.name) || this.isJS(element) || this.isStyle(element)
    : false;
};

/**
 * Return trimmed text, if text requires no structure new lines and spaces will
 * be replaced with a single white space. Any white space adjacent to an inline
 * element is replaced with a single space.
 *
 * @param {Object} element
 * @param {String} data minified content
 * @return {String} text
 * @api public
 */
Helpers.prototype.text = function text(element, data) {
  var ancestors = this.ancestor.length
    , content = element.data
    , next = element.next
    , prev = element.prev;

  //
  // Collapse space between text and inline elements, clobber space without
  // inline elements.
  //
  content = content.replace(/^\s+/, prev && this.isInline(prev) ? ' ' : '');
  content = content.replace(/\s+$/, next && this.isInline(next) ? ' ' : '');

  //
  // If we have ancestors stored do not remove structure.
  //
  if (!ancestors) content = content.replace(/\n/g, ' ').replace(/\s+/g, ' ');

  //
  // Remove CDATA from scripts.
  //
  if (!this.config.cdata && ancestors && this.isJS(this.ancestor[ancestors - 1])) {
    content = content.replace(cdata.start, '').replace(cdata.end, '');
  }

  return content;
};

/**
 * Returned parsed comment or empty string if config.comments = true.
 *
 * @param {Object} element
 * @return {String} comment
 * @api public
 */
Helpers.prototype.comment = function comment(element) {
  if (this.config.conditionals && conditional.test(element.data)) {
    return '<!--' + element.data + '-->';
  }

  return !this.config.comments ? '' : '<!--' + element.data + '-->';
};

/**
 * Return parsed directive.
 *
 * @param {Object} element
 * @return {String} comment
 * @api public
 */
Helpers.prototype.directive = function directive(element) {
  return '<' + element.data + '>';
};

//
// Define some proxies for easy external reference.
//
Helpers.prototype.script = Helpers.prototype.tag;
Helpers.prototype.style = Helpers.prototype.tag;

//
// Expose some additional members while testing.
//
if (process.env.NODE_ENV === 'test') {
  Helpers.prototype.node = node;
  Helpers.prototype.structural = structural;
  Helpers.prototype.retain = retain;
  Helpers.prototype.redundant = redundant;
  Helpers.prototype.inline = inline;
  Helpers.prototype.singular = singular;
  Helpers.prototype.cdata = cdata;
}

//
// Create public proxies.
//
module.exports = Helpers;
