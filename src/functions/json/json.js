'use strict';

// $json[key;...]
// Reads a value from the current JSON context (set by $jsonParse).
// Supports nested keys as multiple args: $json[user;name] → obj.user.name
// Returns "" if the key path doesn't exist.
module.exports = async (context, args) => {
  const raw = context.variables.get('__json_ctx__');
  if (raw === undefined) return '[error: No JSON context loaded; use $jsonParse first!]';

  let obj = raw;
  for (const key of args) {
    if (key === '') break;
    if (obj === null || obj === undefined || typeof obj !== 'object') return '';
    obj = obj[String(key)];
  }
  if (obj === undefined || obj === null) return '';
  return typeof obj === 'object' ? JSON.stringify(obj) : String(obj);
};
