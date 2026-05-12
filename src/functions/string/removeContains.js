'use strict';

// $removeContains[text;word;...;amount?]
// Removes occurrences of each word from text.
// If the last argument is a number, only removes up to that many occurrences per word.
module.exports = async (context, args) => {
  if (args.length < 2) return String(args[0] !== undefined ? args[0] : '');
  let text         = String(args[0] !== undefined ? args[0] : '');
  const lastIsNum  = !isNaN(parseInt(args[args.length - 1])) && args.length > 2;
  const amount     = lastIsNum ? parseInt(args[args.length - 1]) : Infinity;
  const words      = lastIsNum ? args.slice(1, -1) : args.slice(1);

  for (const word of words) {
    if (!word) continue;
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re      = new RegExp(escaped, 'g');
    let   count   = 0;
    text = text.replace(re, match => (count++ < amount ? '' : match));
  }
  return text.replace(/\s{2,}/g, ' ').trim();
};
