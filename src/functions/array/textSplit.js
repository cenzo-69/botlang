'use strict';
// $textSplit[text;separator]  — splits text into the __textsplit__ array
module.exports = async (context, args) => {
  const text = String(args[0] !== undefined ? args[0] : '');
  const sep  = args[1] !== undefined ? String(args[1]) : ',';
  const arr  = text.split(sep);
  context.variables.set('__textsplit__', JSON.stringify(arr));
  return '';
};
