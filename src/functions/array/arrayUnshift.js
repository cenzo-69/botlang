'use strict';

const { argError } = require('../../core/fnError');
// $arrayUnshift[variable;value1;value2;...]  — prepends values to array
module.exports = async (context, args) => {
  const name = String(args[0] !== undefined ? args[0] : '').trim();
  if (!name) return argError(context, 'name', 'string', name);
  const raw = context.variables.get(`__array_${name}__`);
  if (!raw) return `[error: Array "${name}" does not exist!]`;
  let arr;
  try { arr = JSON.parse(raw); } catch { return '[error: Corrupted array data!]'; }
  const values = args.slice(1);
  if (!values.length) return '[error: At least one value is required!]';
  arr.unshift(...values);
  context.variables.set(`__array_${name}__`, JSON.stringify(arr));
  return '';
};
