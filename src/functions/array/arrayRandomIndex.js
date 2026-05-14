'use strict';

const { argError } = require('../../core/fnError');
// $arrayRandomIndex[variable]  — returns a random valid index from the array
module.exports = async (context, args) => {
  const name = String(args[0] !== undefined ? args[0] : '').trim();
  if (!name) return argError(context, 'name', 'string', name);
  const raw = context.variables.get(`__array_${name}__`);
  if (!raw) return `[error: $arrayRandomIndex — array "${name}" does not exist]`;
  try {
    const arr = JSON.parse(raw);
    if (!arr.length) return '[error: $arrayRandomIndex — array is empty]';
    return String(Math.floor(Math.random() * arr.length));
  } catch { return '[error: $arrayRandomIndex — corrupted array data]'; }
};
