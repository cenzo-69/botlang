'use strict';

// $jsonExists[key;...]
// Returns "true" if the key path exists in the current JSON context.
module.exports = async (context, args) => {
  const obj = context.variables.get('__json_ctx__');
  if (obj === undefined) return 'false';

  const keys = args.filter(k => k !== '');
  let cur = obj;
  for (const key of keys) {
    if (cur === null || cur === undefined || typeof cur !== 'object') return 'false';
    if (!(key in cur)) return 'false';
    cur = cur[key];
  }
  return 'true';
};
