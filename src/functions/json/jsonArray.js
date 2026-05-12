'use strict';

// $jsonArray[key;...;index]
// Gets an element of an array at the key path from the current JSON context.
// index is 0-based. Last arg is always the index.
module.exports = async (context, args) => {
  const obj = context.variables.get('__json_ctx__');
  if (obj === undefined) return '[error: $jsonArray — no JSON context loaded]';

  const all  = args.filter(k => k !== '');
  if (all.length < 2) return '[error: $jsonArray requires at least a key and an index]';

  const indexArg = all[all.length - 1];
  const keys     = all.slice(0, -1);
  const index    = parseInt(indexArg);
  if (isNaN(index)) return '[error: $jsonArray — index must be a number]';

  let cur = obj;
  for (const key of keys) {
    if (cur === null || cur === undefined || typeof cur !== 'object') return '';
    cur = cur[key];
  }
  if (!Array.isArray(cur)) return '[error: $jsonArray — target is not an array]';
  const val = cur[index];
  if (val === undefined || val === null) return '';
  return typeof val === 'object' ? JSON.stringify(val) : String(val);
};
