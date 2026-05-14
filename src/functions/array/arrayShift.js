'use strict';

const { argError } = require('../../core/fnError');
// $arrayShift[variable]  — removes and returns the first element of array
module.exports = async (context, args) => {
  const name = String(args[0] !== undefined ? args[0] : '').trim();
  if (!name) return argError(context, 'name', 'string', name);
  const raw = context.variables.get(`__array_${name}__`);
  if (!raw) return `[error: $arrayShift — array "${name}" does not exist]`;
  let arr;
  try { arr = JSON.parse(raw); } catch { return '[error: $arrayShift — corrupted array data]'; }
  if (!arr.length) return '';
  const val = arr.shift();
  context.variables.set(`__array_${name}__`, JSON.stringify(arr));
  return String(val ?? '');
};
