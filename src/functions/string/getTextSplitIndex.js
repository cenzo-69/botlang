'use strict';

// $getTextSplitIndex[index]
// Returns the element at the given 1-based index from the last $textSplit call.
// Returns empty string if the index is out of range.
module.exports = async (context, args) => {
  const stored = context.variables.get('__textsplit__');
  if (!stored) return '[error: no $textSplit result — call $textSplit first]';

  let parts;
  try { parts = JSON.parse(stored); } catch { return '[error: corrupt textSplit state]'; }

  const idx = parseInt(args[0]);
  if (isNaN(idx) || idx < 1 || idx > parts.length) return '';
  return String(parts[idx - 1]);
};
