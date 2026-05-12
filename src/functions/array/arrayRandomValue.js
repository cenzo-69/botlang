'use strict';
// $arrayRandomValue[variable]  — returns a random element from the array
module.exports = async (context, args) => {
  const name = String(args[0] !== undefined ? args[0] : '').trim();
  if (!name) return '[error: $arrayRandomValue — variable name is required]';
  const raw = context.variables.get(`__array_${name}__`);
  if (!raw) return `[error: $arrayRandomValue — array "${name}" does not exist]`;
  try {
    const arr = JSON.parse(raw);
    if (!arr.length) return '[error: $arrayRandomValue — array is empty]';
    return String(arr[Math.floor(Math.random() * arr.length)] ?? '');
  } catch { return '[error: $arrayRandomValue — corrupted array data]'; }
};
