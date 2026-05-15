'use strict';

// $jsonArrayCount[key;...]
// Returns the length of an array at the key path in the current JSON context.
module.exports = async (context, args) => {
  const obj = context.variables.get('__json_ctx__');
  if (obj === undefined) return '[error: No JSON context loaded!]';

  const keys = args.filter(k => k !== '');
  let cur = obj;
  for (const key of keys) {
    if (cur === null || cur === undefined || typeof cur !== 'object') return '0';
    cur = cur[key];
  }
  if (!Array.isArray(cur)) return '[error: Target is not an array!]';
  return String(cur.length);
};
