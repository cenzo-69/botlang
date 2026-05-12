'use strict';

// $replaceRegex[text;pattern;flags;replacement;amount?]
// Replaces matches of pattern (regex) in text with replacement.
module.exports = async (context, args) => {
  const text        = String(args[0] !== undefined ? args[0] : '');
  const pattern     = String(args[1] !== undefined ? args[1] : '');
  const flags       = String(args[2] !== undefined ? args[2] : 'g');
  const replacement = String(args[3] !== undefined ? args[3] : '');
  const amount      = args[4] !== undefined ? parseInt(args[4]) : Infinity;

  if (!pattern) return text;

  try {
    const safeFlags = flags.includes('g') ? flags : flags + 'g';
    const re = new RegExp(pattern, safeFlags);
    if (isFinite(amount)) {
      let count = 0;
      return text.replace(re, (m) => count++ < amount ? replacement : m);
    }
    return text.replace(re, replacement);
  } catch (err) {
    return `[error: $replaceRegex — invalid pattern: ${err.message}]`;
  }
};
