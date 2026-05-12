'use strict';

// $indexOf[text;search;fromIndex?]  — position of first match (-1 if not found)
module.exports = async (context, args) => {
  const text      = String(args[0] ?? '');
  const search    = String(args[1] ?? '');
  const fromIndex = args[2] !== undefined ? parseInt(args[2]) : 0;
  return String(text.indexOf(search, isNaN(fromIndex) ? 0 : fromIndex));
};
