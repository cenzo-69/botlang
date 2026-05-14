'use strict';

const { argError } = require('../../core/fnError');
// $arrayShuffle[variable]  — shuffles the array in place (Fisher-Yates)
module.exports = async (context, args) => {
  const name = String(args[0] !== undefined ? args[0] : '').trim();
  if (!name) return argError(context, 'name', 'string', name);
  const raw = context.variables.get(`__array_${name}__`);
  if (!raw) return `[error: $arrayShuffle — array "${name}" does not exist]`;
  let arr;
  try { arr = JSON.parse(raw); } catch { return '[error: $arrayShuffle — corrupted array data]'; }
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  context.variables.set(`__array_${name}__`, JSON.stringify(arr));
  return '';
};
