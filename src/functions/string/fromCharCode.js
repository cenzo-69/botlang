'use strict';
// $fromCharCode[code1;code2;...]  — returns the characters from given char codes
module.exports = async (context, args) => {
  const codes = args.map(a => parseInt(a)).filter(n => !isNaN(n));
  if (!codes.length) return '[error: $fromCharCode — at least one char code is required]';
  return String.fromCharCode(...codes);
};
