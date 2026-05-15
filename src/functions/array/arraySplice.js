'use strict';

const { argError } = require('../../core/fnError');
// $arraySplice[variable;index;deleteCount;elements?]  — removes elements at index, returns deleted
module.exports = async (context, args) => {
  const name        = String(args[0] !== undefined ? args[0] : '').trim();
  const index       = parseInt(args[1] !== undefined ? args[1] : 0);
  const deleteCount = parseInt(args[2] !== undefined ? args[2] : 0);
  const elements    = args.slice(3);
  if (!name) return argError(context, 'name', 'string', name);
  if (isNaN(index)) return argError(context, 'index', 'number', index);
  const raw = context.variables.get(`__array_${name}__`);
  if (!raw) return `[error: Array "${name}" does not exist!]`;
  let arr;
  try { arr = JSON.parse(raw); } catch { return '[error: Corrupted array data!]'; }
  const deleted = arr.splice(index, isNaN(deleteCount) ? 0 : deleteCount, ...elements);
  context.variables.set(`__array_${name}__`, JSON.stringify(arr));
  return JSON.stringify(deleted);
};
