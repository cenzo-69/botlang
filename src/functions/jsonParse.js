'use strict';

// $jsonParse[json;key?]
// Parse a JSON string. With no key, returns the stringified root.
// key supports dot-path notation: "user.name" drills into nested objects.
module.exports = async (context, args) => {
  const json = args[0] || '';
  const key  = args[1] || '';

  let obj;
  try {
    obj = JSON.parse(json);
  } catch {
    return '[error: invalid JSON]';
  }

  if (!key) {
    return typeof obj === 'object' ? JSON.stringify(obj) : String(obj);
  }

  let val = obj;
  for (const part of key.split('.')) {
    if (val === null || val === undefined || typeof val !== 'object') {
      return '';
    }
    val = val[part];
  }

  if (val === undefined || val === null) return '';
  return typeof val === 'object' ? JSON.stringify(val) : String(val);
};
