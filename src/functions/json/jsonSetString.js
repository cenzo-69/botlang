'use strict';

// $jsonSetString[key;...;value]
// Same as $jsonSet but always stores the value as a string (no auto type coercion).
// Works on the current JSON context.
function setPath(obj, keys, value) {
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (cur[keys[i]] === undefined || typeof cur[keys[i]] !== 'object') {
      cur[keys[i]] = {};
    }
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = value;
}

module.exports = async (context, args) => {
  let root = context.variables.get('__json_ctx__');
  if (root === undefined) return '[error: $jsonSetString — no JSON context loaded]';

  const all = args.filter(k => k !== '');
  if (all.length < 2) return '[error: $jsonSetString requires at least a key and a value]';

  const value = String(all[all.length - 1]);
  const keys  = all.slice(0, -1);

  setPath(root, keys, value);
  context.variables.set('__json_ctx__', root);
  return '';
};
