'use strict';

const { argError } = require('../../core/fnError');
// $arrayIncludes[variable;value]  — returns "true" if value exists in array
module.exports = async (context, args) => {
  const name  = String(args[0] !== undefined ? args[0] : '').trim();
  const value = args[1] !== undefined ? String(args[1]) : '';
  if (!name) return argError(context, 'name', 'string', name);
  const raw = context.variables.get(`__array_${name}__`);
  if (!raw) return `[error: $arrayIncludes — array "${name}" does not exist]`;
  try { return String(JSON.parse(raw).map(String).includes(value)); }
  catch { return '[error: $arrayIncludes — corrupted array data]'; }
};
