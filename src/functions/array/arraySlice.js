'use strict';
// $arraySlice[variable;outputVar?;start;end?]  — slices array and stores in outputVar
module.exports = async (context, args) => {
  const name   = String(args[0] !== undefined ? args[0] : '').trim();
  const outVar = args[1] !== undefined ? String(args[1]).trim() : '';
  const start  = parseInt(args[2] !== undefined ? args[2] : 0) || 0;
  const end    = args[3] !== undefined ? parseInt(args[3]) : undefined;
  if (!name) return '[error: $arraySlice — variable name is required]';
  const raw = context.variables.get(`__array_${name}__`);
  if (!raw) return `[error: $arraySlice — array "${name}" does not exist]`;
  let arr;
  try { arr = JSON.parse(raw); } catch { return '[error: $arraySlice — corrupted array data]'; }
  const sliced = (!isNaN(end) && end !== undefined) ? arr.slice(start, end) : arr.slice(start);
  if (outVar) context.variables.set(`__array_${outVar}__`, JSON.stringify(sliced));
  return JSON.stringify(sliced);
};
