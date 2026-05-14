'use strict';

const { argError } = require('../../core/fnError');
// $arrayAt[variable;index]  — returns element at index (negative counts from end)
module.exports = async (context, args) => {
  const name  = String(args[0] !== undefined ? args[0] : '').trim();
  const index = parseInt(args[1]);
  if (!name) return argError(context, 'name', 'string', name);
  if (isNaN(index)) return argError(context, 'index', 'number', index);
  const raw = context.variables.get(`__array_${name}__`);
  if (!raw) return `[error: $arrayAt — array "${name}" does not exist]`;
  let arr;
  try { arr = JSON.parse(raw); } catch { return '[error: $arrayAt — corrupted array data]'; }
  const val = arr.at(index);
  return val !== undefined ? String(val) : '';
};
