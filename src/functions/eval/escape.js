'use strict';

// $escape[text]
// Escapes $ and ; characters in text so they are not treated as function
// syntax if the result is later passed through $eval.
// Replaces $ → \$ and ; → \;
module.exports = async (context, args) => {
  const text = String(args[0] !== undefined ? args[0] : '');
  return text.replace(/\$/g, '\\$').replace(/;/g, '\\;');
};
