'use strict';

// $jsonArraySort[key;...]
// Sorts a JSON array in-place (numeric if all elements are numbers, otherwise lexicographic).
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
  cur.sort((a, b) => {
    const na = Number(a), nb = Number(b);
    return (!isNaN(na) && !isNaN(nb)) ? na - nb : String(a).localeCompare(String(b));
  });
  context.variables.set('__json_ctx__', root);
  return '';
};
