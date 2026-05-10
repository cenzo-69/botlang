'use strict';

// $split[text;separator;index]  → one element of the split array (1-based)
// $split[text;separator]        → number of parts
module.exports = async (context, args) => {
  const text = String(args[0] || '');
  const sep  = args[1] !== undefined ? String(args[1]) : ' ';
  const parts = text.split(sep);

  if (args[2] !== undefined) {
    const idx = parseInt(args[2]) - 1;
    return parts[idx] !== undefined ? parts[idx] : '';
  }

  return String(parts.length);
};
