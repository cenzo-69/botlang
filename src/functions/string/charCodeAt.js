'use strict';
// $charCodeAt[text;index]  — returns the char code at given index (0-based)
module.exports = async (context, args) => {
  const text  = String(args[0] !== undefined ? args[0] : '');
  const index = parseInt(args[1]) || 0;
  const code  = text.charCodeAt(index);
  if (isNaN(code)) return '[error: $charCodeAt — index out of range]';
  return String(code);
};
