'use strict';

var flow = /<\/[^>]+>$|\w+$/
  , inline = [
        'a', 'abbr', 'acronym', 'b', 'bdo', 'big', 'br', 'button', 'cite'
      , 'code', 'dfn', 'em', 'i', 'img', 'input', 'kbd', 'label', 'map'
      , 'object', 'q', 'samp', 'script', 'select', 'small', 'span', 'strong'
      , 'sub', 'sup', 'textarea', 'tt', 'var'
    ]
  , singular = [
        'colgroup', 'dd', 'dt', 'li', 'options'
      , 'p', 'td', 'tfoot', 'th', 'thead', 'tr'
    ];

function isInline (element) {
  return !!~inline.indexOf(element.name);
}

function tag (element, ancestor, data) {
  return (isInline(element) && data.match(flow) ? ' <' : '<') + element.data + '>';
}

function close (element) {
  return element.type === 'tag' || element.type === 'script'
    ? '</' + element.name + '>'
    : '';
}

function isJS(element) {
  return element.type === 'script'
    && !element.data.match(/script.*?type\s*=\s*.(?!text\/javascript).*/i);
}

function structure(element) {
  return element.type !== 'text'
    ? element.name.match(/pre|textarea/) || isJS(element)
    : false;
}

function text (element, ancestor, data) {
  element = element.data.trim();

  if (!structure(ancestor)) element = element.replace(/\n/, '').replace(/\s+/g, ' ');

  if (data.match(flow)) element = ' ' + element;

  return element;
}

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
  module.exports.tag = tag;
  module.exports.isJS = isJS;
  module.exports.structure  = structure;
  module.exports.isInline = isInline;
  module.exports.flow = flow;
}
