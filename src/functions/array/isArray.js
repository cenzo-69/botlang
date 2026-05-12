'use strict';
// $isArray[variable]  — returns "true" if variable is a valid array
module.exports = async (context, args) => {
  const name = String(args[0] !== undefined ? args[0] : '').trim();
  if (!name) return 'false';
  const raw = context.variables.get(`__array_${name}__`);
  if (!raw) return 'false';
  try { return String(Array.isArray(JSON.parse(raw))); }
  catch { return 'false'; }
};
