'use strict';
// $let[key;value]  — create/set a session variable (alias: $var)
module.exports = async (context, args) => {
  const key   = String(args[0] !== undefined ? args[0] : '').trim();
  const value = args[1] !== undefined ? String(args[1]) : '';
  if (!key) return '[error: $let — key is required. Usage: $let[varName;value]]';
  context.variables.set(key, value);
  return '';
};
