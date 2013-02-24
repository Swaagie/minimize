'use strict';

function tag (element) {
  return '<' + element.data + '>';
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

function requiresFlow(element) {
  return element.type !== 'text'
    ? element.name.match(/pre|textarea/) || isJS(element)
    : false;
}

function text (element, parent) {
  element = element.data;

  if (!requiresFlow(parent)) element = element.replace(/\n/, '').replace(/\s+/g, ' ');

  return element.trim();
}

module.exports = {
    close: close
  , map: {
        directive: tag
      , tag: tag
      , text: text
      , script: tag
    }
};

/**
 * Expose some additional modules while testing.
 */
if (process.env.NODE_ENV === 'test') {
  module.exports.tag = tag;
  module.exports.text = text;
  module.exports.text = isJS;
  module.exports.text = requiresFlow;
}
