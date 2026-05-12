'use strict';

// $jsonArrayUnshift[key;...;value]
// Prepends a value to the beginning of a JSON array at the given key path.
module.exports = async (context, args) => {
  const root = context.variables.get('__json_ctx__');
  if (root === undefined) return '[error: $jsonArrayUnshift — no JSON context]';
  const all = args.filter(k => k !== '');
  if (all.length < 2) return '[error: $jsonArrayUnshift requires a key path and a value]';
  const value = all[all.length - 1];
  const keys  = all.slice(0, -1);
  let cur = root;
  for (const key of keys) {
    if (!cur || typeof cur !== 'object') return '[error: $jsonArrayUnshift — invalid path]';
    cur = cur[key];
  }
  if (!Array.isArray(cur)) return '[error: $jsonArrayUnshift — target is not an array]';
  cur.unshift(value);
  context.variables.set('__json_ctx__', root);
  return '';
};
