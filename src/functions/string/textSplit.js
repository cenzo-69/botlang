'use strict';

// $textSplit[text;separator]
// Splits text by separator and stores the result for indexed access via
// $getTextSplitIndex[n]. The split result is stored in the shared variables
// map under a sentinel key so it is visible to the whole execution tree.
module.exports = async (context, args) => {
  const text = String(args[0] !== undefined ? args[0] : '');
  const sep  = String(args[1] !== undefined ? args[1] : ',');

  const parts = text.split(sep);
  context.variables.set('__textsplit__', JSON.stringify(parts));
  return '';
};
