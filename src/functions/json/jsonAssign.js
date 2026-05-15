'use strict';
// $jsonAssign[target;source]  — merges source JSON object into target JSON object
module.exports = async (context, args) => {
  const target = String(args[0] !== undefined ? args[0] : '{}');
  const source = String(args[1] !== undefined ? args[1] : '{}');
  try {
    const t = JSON.parse(target);
    const s = JSON.parse(source);
    if (typeof t !== 'object' || typeof s !== 'object') return '[error: Both arguments must be JSON objects!]';
    return JSON.stringify(Object.assign(t, s));
  } catch (err) { return `[error: ${err.message}!]`; }
};
