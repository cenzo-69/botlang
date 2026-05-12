'use strict';
// $arrayIndexOf[variable;value]  — returns 0-based index of first match, or -1
module.exports = async (context, args) => {
  const name  = String(args[0] !== undefined ? args[0] : '').trim();
  const value = args[1] !== undefined ? String(args[1]) : '';
  if (!name) return '[error: $arrayIndexOf — variable name is required]';
  const raw = context.variables.get(`__array_${name}__`);
  if (!raw) return `[error: $arrayIndexOf — array "${name}" does not exist]`;
  try { return String(JSON.parse(raw).map(String).indexOf(value)); }
  catch { return '[error: $arrayIndexOf — corrupted array data]'; }
};
