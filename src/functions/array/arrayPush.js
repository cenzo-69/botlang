'use strict';
// $arrayPush[variable;value1;value2;...]  — appends values to array
module.exports = async (context, args) => {
  const name = String(args[0] !== undefined ? args[0] : '').trim();
  if (!name) return '[error: $arrayPush — variable name is required]';
  const raw = context.variables.get(`__array_${name}__`);
  if (!raw) return `[error: $arrayPush — array "${name}" does not exist. Create it first with $arrayCreate]`;
  let arr;
  try { arr = JSON.parse(raw); } catch { return '[error: $arrayPush — corrupted array data]'; }
  const values = args.slice(1);
  if (!values.length) return '[error: $arrayPush — at least one value is required]';
  arr.push(...values);
  context.variables.set(`__array_${name}__`, JSON.stringify(arr));
  return '';
};
