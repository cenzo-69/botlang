'use strict';
// $jsonValues[json;separator?]  — returns all values of a JSON object
module.exports = async (context, args) => {
  const json = String(args[0] !== undefined ? args[0] : '{}');
  const sep  = String(args[1] !== undefined ? args[1] : ', ');
  try { return Object.values(JSON.parse(json)).map(v => JSON.stringify(v)).join(sep); }
  catch (err) { return `[error: ${err.message}!]`; }
};
