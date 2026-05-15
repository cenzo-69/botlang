'use strict';

const { argError } = require('../../core/fnError');
// $splitText[index]  — gets element at 1-based index from __textsplit__ array
module.exports = async (context, args) => {
  const index = parseInt(args[0]);
  if (isNaN(index)) return argError(context, 'index', 'number', index);
  const raw = context.variables.get('__textsplit__');
  if (!raw) return '[error: No $textSplit has been called yet!]';
  try {
    const arr = JSON.parse(raw);
    return String(arr[index - 1] ?? '');
  } catch { return '[error: Corrupted split data!]'; }
};
