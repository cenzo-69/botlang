'use strict';

const { argError } = require('../../core/fnError');
// $arrayRandomValue[variable]  — returns a random element from the array
module.exports = async (context, args) => {
  const name = String(args[0] !== undefined ? args[0] : '').trim();
  if (!name) return argError(context, 'name', 'string', name);
  const raw = context.variables.get(`__array_${name}__`);
  if (!raw) return `[error: Array "${name}" does not exist!]`;
  try {
    const arr = JSON.parse(raw);
    if (!arr.length) return '[error: Array is empty!]';
    return String(arr[Math.floor(Math.random() * arr.length)] ?? '');
  } catch { return '[error: Corrupted array data!]'; }
};
