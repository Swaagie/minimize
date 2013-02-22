'use strict';
// @param {Boolean} close
function tag (data, close) {
  return (close ? '</' : '<') + data + '>';
}

function text (data) {
  return data;
}

module.exports.map = {
    directive: tag
  , tag: tag
  , text: text
  , script: tag
};
