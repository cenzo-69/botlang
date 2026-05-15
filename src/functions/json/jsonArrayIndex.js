'use strict';

// $jsonArrayIndex[key;...;value]
// Returns the 0-based index of a value in a JSON array, or -1 if not found.
module.exports = async (context, args) => {
  const root = context.variables.get('__json_ctx__');
  if (root === undefined) return '[error: No JSON context!]';
  const all = args.filter(k => k !== '');
  if (all.length < 2) return '[error: $jsonArrayIndex requires a key path and a value!]';
  const value = all[all.length - 1];
  const keys  = all.slice(0, -1);
  let cur = root;
  for (const key of keys) {
    if (!cur || typeof cur !== 'object') return '-1';
    cur = cur[key];
  }
  if (!Array.isArray(cur)) return '-1';
  return String(cur.indexOf(value));
};
