'use strict';

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
  , structural = /pre|textarea/;

/**
 * Is an element inline or not.
 *
 * @param {Object} element
 * @return {Boolean}
 * @api private
 */
function isInline (element) {
  return !!~inline.indexOf(element.name);
}

/**
 * Create starting tag for element, if required an additional white space will
 * be added to retain flow of inline elements.
 *
 * @param {Object} element
 * @return {String}
 * @api public
 */
function tag (element, ancestor, data) {
  return (isInline(element) && data.match(flow) ? ' <' : '<') + element.data + '>';
}

/**
 * Provide closing tag for element if required.
 *
 * @param {Object} element
 * @return {String}
 * @api public
 */
function close (element) {
  return element.type.match(node) && !~singular.indexOf(element.name)
    ? '</' + element.name + '>'
    : '';
}

/**
 * Check the script is actual script or abused for template/config. Scripts
 * without attribute type or type="text/javascript" are JS elements by default.
 *
 * @param {Object} element
 * @return {Boolean}
 * @api private
 */
function isJS(element) {
  return element.type === 'script'
    && !element.data.match(/script.*?type\s*=\s*.(?!text\/javascript).*/i);
}

/**
 * Check if an element needs to retain its internal structure, e.g. this goes
 * for elements like script, textarea or pre.
 *
 * @param {Object} element
 * @return {Boolean}
 * @api private
 */
function structure(element) {
  return element.type !== 'text'
    ? element.name.match(structural) || isJS(element)
    : false;
}

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
function text (element, ancestor, data) {
  element = element.data.trim();

  if (!structure(ancestor)) element = element.replace(/\n/, '').replace(/\s+/g, ' ');
  if (data.match(flow)) element = ' ' + element;

  return element;
}

/**
 * Create public proxies.
 */
module.exports = {
    close: close
  , directive: tag
  , tag: tag
  , text: text
  , script: tag
};

/**
 * Expose some additional modules while testing.
 */
if (process.env.NODE_ENV === 'test') {
  module.exports.isJS = isJS;
  module.exports.structure  = structure;
  module.exports.isInline = isInline;
  module.exports.flow = flow;
  module.exports.node = node;
  module.exports.structural = structural;
  module.exports.inline = inline;
  module.exports.singular = singular;
}
