'use strict';
// $jsonKeys[json;separator?]  — returns all keys of a JSON object
module.exports = async (context, args) => {
  const json = String(args[0] !== undefined ? args[0] : '{}');
  const sep  = String(args[1] !== undefined ? args[1] : ', ');
  try { return Object.keys(JSON.parse(json)).join(sep); }
  catch (err) { return `[error: ${err.message}!]`; }
};
