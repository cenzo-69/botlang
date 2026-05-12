'use strict';
// $getSplitTextLength  — returns the element count of the __textsplit__ array
module.exports = async (context) => {
  const raw = context.variables.get('__textsplit__');
  if (!raw) return '0';
  try { return String(JSON.parse(raw).length); }
  catch { return '0'; }
};
