'use strict';

// $jsonSet[json;path;value]
// Sets a nested value in a JSON string using dot-path notation and returns
// the updated JSON string.
// e.g. $jsonSet[{"x":1};x;99]  →  {"x":"99"}
module.exports = async (context, args) => {
  const json  = String(args[0] !== undefined ? args[0] : '{}');
  const path  = String(args[1] !== undefined ? args[1] : '');
  const value = String(args[2] !== undefined ? args[2] : '');

  let obj;
  try { obj = JSON.parse(json); } catch { return '[error: invalid JSON]'; }

  if (!path) return json;

  const parts = path.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (typeof cur[parts[i]] !== 'object' || cur[parts[i]] === null) {
      cur[parts[i]] = {};
    }
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;

  return JSON.stringify(obj);
};
