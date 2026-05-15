'use strict';

const { argError } = require('../../core/fnError');
// $arrayLastIndexOf[variable;value]  — returns 0-based index of last match, or -1
module.exports = async (context, args) => {
  const name  = String(args[0] !== undefined ? args[0] : '').trim();
  const value = args[1] !== undefined ? String(args[1]) : '';
  if (!name) return argError(context, 'name', 'string', name);
  const raw = context.variables.get(`__array_${name}__`);
  if (!raw) return `[error: Array "${name}" does not exist!]`;
  try { return String(JSON.parse(raw).map(String).lastIndexOf(value)); }
  catch { return '[error: Corrupted array data!]'; }
};
