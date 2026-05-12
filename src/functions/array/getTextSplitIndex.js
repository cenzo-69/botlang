'use strict';
// $getTextSplitIndex[element]  — returns 1-based index of element in __textsplit__
module.exports = async (context, args) => {
  const elem = String(args[0] !== undefined ? args[0] : '');
  const raw  = context.variables.get('__textsplit__');
  if (!raw) return '[error: $getTextSplitIndex — no $textSplit has been called yet]';
  try {
    const idx = JSON.parse(raw).map(String).indexOf(elem);
    return String(idx === -1 ? -1 : idx + 1);
  } catch { return '[error: $getTextSplitIndex — corrupted split data]'; }
};
