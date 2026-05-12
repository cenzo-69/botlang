'use strict';
// $get[key]  — retrieve a session variable value (alias: $getVar)
module.exports = async (context, args) => {
  const key = String(args[0] !== undefined ? args[0] : '').trim();
  if (!key) return '[error: $get — key is required. Usage: $get[varName]]';
  return String(context.variables.get(key) ?? '');
};
