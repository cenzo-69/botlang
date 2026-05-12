'use strict';
// $arrayJoin[variable;separator?]  — joins all elements with separator
module.exports = async (context, args) => {
  const name = String(args[0] !== undefined ? args[0] : '').trim();
  const sep  = args[1] !== undefined ? String(args[1]) : ', ';
  if (!name) return '[error: $arrayJoin — variable name is required]';
  const raw = context.variables.get(`__array_${name}__`);
  if (!raw) return `[error: $arrayJoin — array "${name}" does not exist]`;
  try { return JSON.parse(raw).join(sep); }
  catch { return '[error: $arrayJoin — corrupted array data]'; }
};
