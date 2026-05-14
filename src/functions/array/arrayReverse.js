'use strict';

const { argError } = require('../../core/fnError');
// $arrayReverse[variable;outputVar?]  — reverses the array in place (or into outputVar)
module.exports = async (context, args) => {
  const name   = String(args[0] !== undefined ? args[0] : '').trim();
  const outVar = args[1] !== undefined ? String(args[1]).trim() : '';
  if (!name) return argError(context, 'name', 'string', name);
  const raw = context.variables.get(`__array_${name}__`);
  if (!raw) return `[error: $arrayReverse — array "${name}" does not exist]`;
  let arr;
  try { arr = JSON.parse(raw); } catch { return '[error: $arrayReverse — corrupted array data]'; }
  const reversed = [...arr].reverse();
  const target = outVar || name;
  context.variables.set(`__array_${target}__`, JSON.stringify(reversed));
  return outVar ? '' : JSON.stringify(reversed);
};
