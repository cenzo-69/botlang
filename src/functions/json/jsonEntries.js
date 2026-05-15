'use strict';
// $jsonEntries[json;separator?]  — returns key=value pairs of a JSON object
module.exports = async (context, args) => {
  const json = String(args[0] !== undefined ? args[0] : '{}');
  const sep  = String(args[1] !== undefined ? args[1] : ', ');
  try {
    const obj = JSON.parse(json);
    return Object.entries(obj).map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(sep);
  } catch (err) { return `[error: ${err.message}!]`; }
};
