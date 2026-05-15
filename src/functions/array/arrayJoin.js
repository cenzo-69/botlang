'use strict';

const { argError } = require('../../core/fnError');
// $arrayJoin[variable;separator?]  — joins all elements with separator
module.exports = async (context, args) => {
  const name = String(args[0] !== undefined ? args[0] : '').trim();
  const sep  = args[1] !== undefined ? String(args[1]) : ', ';
  if (!name) return argError(context, 'name', 'string', name);
  const raw = context.variables.get(`__array_${name}__`);
  if (!raw) return `[error: Array "${name}" does not exist!]`;
  try { return JSON.parse(raw).join(sep); }
  catch { return '[error: Corrupted array data!]'; }
};
