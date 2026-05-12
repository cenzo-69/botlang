'use strict';

// $jsonArrayShift[key;...]
// Removes and returns the first element of an array at the key path.
module.exports = async (context, args) => {
  let root = context.variables.get('__json_ctx__');
  if (root === undefined) return '[error: $jsonArrayShift — no JSON context loaded]';

  const keys = args.filter(k => k !== '');
  let cur = root;
  for (const key of keys) {
    if (cur === null || cur === undefined || typeof cur !== 'object') return '';
    cur = cur[key];
  }
  if (!Array.isArray(cur)) return '[error: $jsonArrayShift — target is not an array]';
  const val = cur.shift();
  context.variables.set('__json_ctx__', root);
  if (val === undefined || val === null) return '';
  return typeof val === 'object' ? JSON.stringify(val) : String(val);
};
