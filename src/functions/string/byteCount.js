'use strict';

// $byteCount[text]
// Returns the UTF-8 byte length of the text.
module.exports = async (context, args) => {
  const text = String(args[0] !== undefined ? args[0] : '');
  return String(Buffer.byteLength(text, 'utf8'));
};
