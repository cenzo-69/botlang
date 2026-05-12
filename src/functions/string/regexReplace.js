'use strict';

// $regexReplace[text;pattern;replacement;flags?]
// Replace regex matches in text. Flags default to 'g'.
module.exports = async (context, args) => {
  const text        = String(args[0] ?? '');
  const pattern     = String(args[1] ?? '');
  const replacement = String(args[2] ?? '');
  const flags       = String(args[3] ?? 'g');
  try {
    const regex = new RegExp(pattern, flags);
    return text.replace(regex, replacement);
  } catch (e) {
    return `[regexReplace error: ${e.message}]`;
  }
};
