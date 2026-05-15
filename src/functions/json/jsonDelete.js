'use strict';
// $jsonDelete[json;key1;key2;...]  — removes keys from a JSON object
module.exports = async (context, args) => {
  const json = String(args[0] !== undefined ? args[0] : '{}');
  const keys = args.slice(1).map(a => String(a).trim()).filter(Boolean);
  if (!keys.length) return json;
  try {
    const obj = JSON.parse(json);
    for (const key of keys) delete obj[key];
    return JSON.stringify(obj);
  } catch (err) { return `[error: ${err.message}!]`; }
};
