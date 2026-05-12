'use strict';
// $letDivide[key;value]  — shorthand for $let[key;$divide[$get[key];value]]
module.exports = async (context, args) => {
  const key   = String(args[0] !== undefined ? args[0] : '').trim();
  const value = parseFloat(args[1] !== undefined ? args[1] : 1);
  if (!key) return '[error: $letDivide — key is required]';
  if (isNaN(value)) return '[error: $letDivide — value must be a valid number]';
  if (value === 0) return '[error: $letDivide — cannot divide by zero]';
  const current = parseFloat(context.variables.get(key) ?? 0) || 0;
  context.variables.set(key, String(current / value));
  return '';
};
