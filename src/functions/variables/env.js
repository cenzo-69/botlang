'use strict';
// $env[key]  — retrieves a process environment variable value
module.exports = async (context, args) => {
  const key = String(args[0] !== undefined ? args[0] : '').trim();
  if (!key) return '[error: $env — key is required. Usage: $env[MY_VAR]]';
  return String(process.env[key] ?? '');
};
