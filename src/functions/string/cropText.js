'use strict';

// $cropText[text;maxLength;suffix?]
// Truncate text to maxLength characters, appending suffix if truncated (default: "...")
module.exports = async (context, args) => {
  const text      = String(args[0] || '');
  const maxLen    = parseInt(args[1]);
  const suffix    = args[2] !== undefined ? String(args[2]) : '...';
  if (isNaN(maxLen) || maxLen < 0) return text;
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen) + suffix;
};
