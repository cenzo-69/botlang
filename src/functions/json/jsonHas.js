'use strict';

const { argError } = require('../../core/fnError');
// $jsonHas[json;key]  — returns "true" if JSON object has the given key
module.exports = async (context, args) => {
  const json = String(args[0] !== undefined ? args[0] : '{}');
  const key  = String(args[1] !== undefined ? args[1] : '').trim();
  if (!key) return argError(context, 'key', 'string', key);
  try {
    const obj = JSON.parse(json);
    return String(Object.prototype.hasOwnProperty.call(obj, key));
  } catch (err) { return `[error: ${err.message}!]`; }
};
