'use strict';
// $has[key]  — returns "true" if session variable exists
module.exports = async (context, args) => {
  const key = String(args[0] !== undefined ? args[0] : '').trim();
  if (!key) return '[error: $has — key is required]';
  return String(context.variables.has(key));
};
