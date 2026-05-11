'use strict';

// $jsonGet[json;path]
// Gets a nested value from a JSON string using dot-path notation.
// e.g. $jsonGet[{"user":{"name":"Alice"}};user.name]  →  Alice
module.exports = async (context, args) => {
  const json = String(args[0] !== undefined ? args[0] : '');
  const path = String(args[1] !== undefined ? args[1] : '');

  let obj;
  try { obj = JSON.parse(json); } catch { return '[error: invalid JSON]'; }

  if (!path) {
    return typeof obj === 'object' ? JSON.stringify(obj) : String(obj);
  }

  const parts = path.split('.');
  let cur = obj;
  for (const part of parts) {
    if (cur === null || cur === undefined) return '';
    cur = cur[part];
  }

  if (cur === null || cur === undefined) return '';
  if (typeof cur === 'object') return JSON.stringify(cur);
  return String(cur);
};
