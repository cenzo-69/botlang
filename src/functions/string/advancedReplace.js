'use strict';

// $advancedReplace[text;match;replacement;amount?]
// Replaces all (or limited count of) occurrences of match in text.
// match can be a plain string or /regex/flags pattern.
module.exports = async (context, args) => {
  const text        = String(args[0] !== undefined ? args[0] : '');
  const match       = String(args[1] !== undefined ? args[1] : '');
  const replacement = String(args[2] !== undefined ? args[2] : '');
  const amount      = args[3] !== undefined ? parseInt(args[3]) : Infinity;

  if (!match) return text;

  // Support /pattern/flags syntax
  const regexMatch = match.match(/^\/(.+)\/([gimsuy]*)$/);
  if (regexMatch) {
    try {
      const flags = regexMatch[2].includes('g') ? regexMatch[2] : regexMatch[2] + 'g';
      const re = new RegExp(regexMatch[1], flags);
      if (isFinite(amount)) {
        let count = 0;
        return text.replace(re, (m) => count++ < amount ? replacement : m);
      }
      return text.replace(re, replacement);
    } catch {
      return '[error: $advancedReplace — invalid regex pattern]';
    }
  }

  // Plain string replacement
  if (!isFinite(amount)) return text.split(match).join(replacement);
  let result = text, count = 0;
  while (count < amount) {
    const idx = result.indexOf(match);
    if (idx === -1) break;
    result = result.slice(0, idx) + replacement + result.slice(idx + match.length);
    count++;
  }
  return result;
};
