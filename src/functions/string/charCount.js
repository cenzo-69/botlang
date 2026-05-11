'use strict';

// $charCount[text]  — returns the number of characters in text (alias for $length)
module.exports = async (context, args) => {
  return String(String(args[0] || '').length);
};
