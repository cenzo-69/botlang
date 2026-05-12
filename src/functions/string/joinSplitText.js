'use strict';

// $joinSplitText[separator?]
// Joins the current text-split array back into a single string.
// Uses the separator provided, or the original separator by default.
module.exports = async (context, args) => {
  const sep     = String(args[0] !== undefined ? args[0] : '').trim() || ',';
  const raw     = context.variables.get('__textsplit__');
  if (!raw) return '';
  let arr;
  try { arr = JSON.parse(raw); } catch { return ''; }
  if (!Array.isArray(arr)) return '';
  return arr.join(sep);
};
