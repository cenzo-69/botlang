'use strict';

const { argError } = require('../../core/fnError');
// $arrayLength[variable]  — returns the number of elements in the array
module.exports = async (context, args) => {
  const name = String(args[0] !== undefined ? args[0] : '').trim();
  if (!name) return argError(context, 'name', 'string', name);
  const raw = context.variables.get(`__array_${name}__`);
  if (!raw) return `[error: Array "${name}" does not exist!]`;
  try { return String(JSON.parse(raw).length); } catch { return '[error: Corrupted array data!]'; }
};
