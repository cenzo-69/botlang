'use strict';

// $unescape[text]
// Removes backslash escaping from text (e.g. \; becomes ;, \$ becomes $).
module.exports = async (context, args) => {
  const text = String(args[0] !== undefined ? args[0] : '');
  return text.replace(/\\(.)/g, '$1');
};
