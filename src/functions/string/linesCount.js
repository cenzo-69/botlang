'use strict';

// $linesCount[text]  — returns the number of lines in text (split by newline)
module.exports = async (context, args) => {
  const text = String(args[0] || '');
  if (!text) return '0';
  return String(text.split('\n').length);
};
