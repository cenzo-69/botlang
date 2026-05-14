'use strict';

const { argError } = require('../../core/fnError');
// $arrayPop[variable]  — removes and returns the last element of array
module.exports = async (context, args) => {
  const name = String(args[0] !== undefined ? args[0] : '').trim();
  if (!name) return argError(context, 'name', 'string', name);
  const raw = context.variables.get(`__array_${name}__`);
  if (!raw) return `[error: $arrayPop — array "${name}" does not exist]`;
  let arr;
  try { arr = JSON.parse(raw); } catch { return '[error: $arrayPop — corrupted array data]'; }
  if (!arr.length) return '';
  const val = arr.pop();
  context.variables.set(`__array_${name}__`, JSON.stringify(arr));
  return String(val ?? '');
};
