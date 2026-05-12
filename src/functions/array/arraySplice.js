'use strict';
// $arraySplice[variable;index;deleteCount;elements?]  — removes elements at index, returns deleted
module.exports = async (context, args) => {
  const name        = String(args[0] !== undefined ? args[0] : '').trim();
  const index       = parseInt(args[1] !== undefined ? args[1] : 0);
  const deleteCount = parseInt(args[2] !== undefined ? args[2] : 0);
  const elements    = args.slice(3);
  if (!name) return '[error: $arraySplice — variable name is required]';
  if (isNaN(index)) return '[error: $arraySplice — index must be a valid integer]';
  const raw = context.variables.get(`__array_${name}__`);
  if (!raw) return `[error: $arraySplice — array "${name}" does not exist]`;
  let arr;
  try { arr = JSON.parse(raw); } catch { return '[error: $arraySplice — corrupted array data]'; }
  const deleted = arr.splice(index, isNaN(deleteCount) ? 0 : deleteCount, ...elements);
  context.variables.set(`__array_${name}__`, JSON.stringify(arr));
  return JSON.stringify(deleted);
};
