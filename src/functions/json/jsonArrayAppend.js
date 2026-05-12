'use strict';

// $jsonArrayAppend[key;...;value]
// Appends a value to an array at the key path in the current JSON context.
// Last arg is always the value to append.
module.exports = async (context, args) => {
  let root = context.variables.get('__json_ctx__');
  if (root === undefined) return '[error: $jsonArrayAppend — no JSON context loaded]';

  const all = args.filter(k => k !== '');
  if (all.length < 2) return '[error: $jsonArrayAppend requires a key and a value]';

  const value = all[all.length - 1];
  const keys  = all.slice(0, -1);

  let cur = root;
  for (const key of keys) {
    if (cur === null || cur === undefined || typeof cur !== 'object') return '[error: $jsonArrayAppend — invalid path]';
    cur = cur[key];
  }
  if (!Array.isArray(cur)) return '[error: $jsonArrayAppend — target is not an array]';
  cur.push(value);
  context.variables.set('__json_ctx__', root);
  return '';
};
