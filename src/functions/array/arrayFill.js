'use strict';

const { argError } = require('../../core/fnError');
// $arrayFill[variable;value]  — fills all elements of the array with value
module.exports = async (context, args) => {
  const name  = String(args[0] !== undefined ? args[0] : '').trim();
  const value = args[1] !== undefined ? args[1] : null;
  if (!name) return argError(context, 'name', 'string', name);
  const raw = context.variables.get(`__array_${name}__`);
  if (!raw) return `[error: $arrayFill — array "${name}" does not exist]`;
  let arr;
  try { arr = JSON.parse(raw); } catch { return '[error: $arrayFill — corrupted array data]'; }
  context.variables.set(`__array_${name}__`, JSON.stringify(arr.fill(value)));
  return '';
};
