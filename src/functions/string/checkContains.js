'use strict';

// $checkContains[text;word;...]
// Returns "true" if text contains any of the provided words (case-insensitive).
module.exports = async (context, args) => {
  const text  = String(args[0] !== undefined ? args[0] : '').toLowerCase();
  const words = args.slice(1).filter(Boolean);
  if (!words.length) return 'false';
  return String(words.some(w => text.includes(w.toLowerCase())));
};
