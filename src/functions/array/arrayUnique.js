'use strict';

const { argError } = require('../../core/fnError');
// $arrayUnique[variable;outputVar?]  — removes duplicate elements
module.exports = async (context, args) => {
  const name   = String(args[0] !== undefined ? args[0] : '').trim();
  const outVar = args[1] !== undefined ? String(args[1]).trim() : '';
  if (!name) return argError(context, 'name', 'string', name);
  const raw = context.variables.get(`__array_${name}__`);
  if (!raw) return `[error: Array "${name}" does not exist!]`;
  let arr;
  try { arr = JSON.parse(raw); } catch { return '[error: Corrupted array data!]'; }
  const unique = [...new Set(arr.map(String))];
  const target = outVar || name;
  context.variables.set(`__array_${target}__`, JSON.stringify(unique));
  return outVar ? '' : JSON.stringify(unique);
};
