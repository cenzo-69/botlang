'use strict';

// $padEnd[text;length;fillChar?]  — pad text from the right
module.exports = async (context, args) => {
  const text     = String(args[0] ?? '');
  const len      = parseInt(args[1]);
  const fillChar = args[2] !== undefined ? String(args[2]) : ' ';
  if (isNaN(len)) return '[padEnd error: invalid length]';
  return text.padEnd(len, fillChar);
};
