'use strict';

// $jsonArrayReverse[key;...]
// Reverses a JSON array in-place at the given key path.
module.exports = async (context, args) => {
  const root = context.variables.get('__json_ctx__');
  if (root === undefined) return '[error: No JSON context!]';
  const keys = args.filter(k => k !== '');
  let cur = root;
  for (const key of keys) {
    if (!cur || typeof cur !== 'object') return '[error: Invalid path!]';
    cur = cur[key];
  }
  if (!Array.isArray(cur)) return '[error: Target is not an array!]';
  cur.reverse();
  context.variables.set('__json_ctx__', root);
  return '';
};
