'use strict';
// $arrayAt[variable;index]  — returns element at index (negative counts from end)
module.exports = async (context, args) => {
  const name  = String(args[0] !== undefined ? args[0] : '').trim();
  const index = parseInt(args[1]);
  if (!name) return '[error: $arrayAt — variable name is required]';
  if (isNaN(index)) return '[error: $arrayAt — index must be a valid integer]';
  const raw = context.variables.get(`__array_${name}__`);
  if (!raw) return `[error: $arrayAt — array "${name}" does not exist]`;
  let arr;
  try { arr = JSON.parse(raw); } catch { return '[error: $arrayAt — corrupted array data]'; }
  const val = arr.at(index);
  return val !== undefined ? String(val) : '';
};
