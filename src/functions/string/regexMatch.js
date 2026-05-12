'use strict';

// $regexMatch[text;pattern;flags?]
// Returns the first match, or empty string if no match.
// Use flags like g, i, m (default: none).
module.exports = async (context, args) => {
  const text    = String(args[0] ?? '');
  const pattern = String(args[1] ?? '');
  const flags   = String(args[2] ?? '');
  try {
    const regex = new RegExp(pattern, flags);
    const match = text.match(regex);
    if (!match) return '';
    return match[0];
  } catch (e) {
    return `[regexMatch error: ${e.message}]`;
  }
};
