'use strict';
// $letSum[key;value]  — shorthand for $let[key;$add[$get[key];value]]
module.exports = async (context, args) => {
  const key   = String(args[0] !== undefined ? args[0] : '').trim();
  const value = parseFloat(args[1] !== undefined ? args[1] : 0);
  if (!key) return '[error: $letSum — key is required]';
  if (isNaN(value)) return '[error: $letSum — value must be a valid number]';
  const current = parseFloat(context.variables.get(key) ?? 0) || 0;
  context.variables.set(key, String(current + value));
  return '';
};
