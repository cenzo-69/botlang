'use strict';

// $jsonJoinArray[key;...;separator]
// Joins all elements of a JSON array at the given key path using the separator.
// Last argument is always the separator.
module.exports = async (context, args) => {
  const root = context.variables.get('__json_ctx__');
  if (root === undefined) return '[error: $jsonJoinArray — no JSON context]';
  const all = args.filter(k => k !== '');
  if (!all.length) return '[error: $jsonJoinArray requires a key path and separator]';
  const sep  = all[all.length - 1];
  const keys = all.slice(0, -1);
  let cur = root;
  for (const key of keys) {
    if (!cur || typeof cur !== 'object') return '';
    cur = cur[key];
  }
  if (!Array.isArray(cur)) return String(cur ?? '');
  return cur.join(sep);
};
