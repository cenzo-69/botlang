'use strict';

// $jsonUnset[key;...]
// Deletes a key (or nested key path) from the current JSON context.
module.exports = async (context, args) => {
  let obj = context.variables.get('__json_ctx__');
  if (obj === undefined) return '[error: $jsonUnset — no JSON context loaded]';

  const keys = args.filter(k => k !== '');
  if (!keys.length) return '';

  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    cur = cur[keys[i]];
    if (cur === null || cur === undefined || typeof cur !== 'object') return '';
  }
  delete cur[keys[keys.length - 1]];
  context.variables.set('__json_ctx__', obj);
  return '';
};
