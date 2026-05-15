'use strict';
// $advancedTextSplit[text;split1;index1;split2;index2;...]
// Splits text multiple times. Each pair (separator, index) applies to the result of the last split.
module.exports = async (context, args) => {
  let text = String(args[0] !== undefined ? args[0] : '');
  const pairs = args.slice(1);
  if (pairs.length < 2) return '[error: Requires text + at least one split;index pair!]';
  for (let i = 0; i < pairs.length - 1; i += 2) {
    const sep   = String(pairs[i]);
    const index = parseInt(pairs[i + 1]);
    if (isNaN(index)) return `[error: Index at position ${i + 1} is not a number!]`;
    const parts = text.split(sep);
    const val = parts[index - 1];
    if (val === undefined) return '';
    text = val;
  }
  return text;
};
