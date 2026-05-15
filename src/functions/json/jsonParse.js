'use strict';

// $jsonParse[json;key?]
// Parses a JSON string and stores it as the active JSON context for $json/$jsonSet/etc.
// With no key, returns the stringified root. With a key (dot-path), returns that value.
module.exports = async (context, args) => {
  const json = args[0] || '';
  const key  = args[1] || '';

  let obj;
  try {
    obj = JSON.parse(json);
  } catch {
    return '[error: Invalid JSON!]';
  }

  context.variables.set('__json_ctx__', obj);

  if (!key) return '';

  let val = obj;
  for (const part of key.split('.')) {
    if (val === null || val === undefined || typeof val !== 'object') return '';
    val = val[part];
  }
  if (val === undefined || val === null) return '';
  return typeof val === 'object' ? JSON.stringify(val) : String(val);
};
