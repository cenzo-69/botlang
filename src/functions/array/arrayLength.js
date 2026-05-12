'use strict';
// $arrayLength[variable]  — returns the number of elements in the array
module.exports = async (context, args) => {
  const name = String(args[0] !== undefined ? args[0] : '').trim();
  if (!name) return '[error: $arrayLength — variable name is required]';
  const raw = context.variables.get(`__array_${name}__`);
  if (!raw) return `[error: $arrayLength — array "${name}" does not exist]`;
  try { return String(JSON.parse(raw).length); } catch { return '[error: $arrayLength — corrupted array data]'; }
};
