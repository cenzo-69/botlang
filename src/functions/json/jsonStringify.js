'use strict';

// $jsonStringify[key1;value1;key2;value2;...]
// Build a JSON object from key-value pairs (args come in pairs).
// Odd number of args: last key gets an empty string value.
module.exports = async (context, args) => {
  const obj = {};
  for (let i = 0; i < args.length; i += 2) {
    const k = args[i];
    const v = args[i + 1] !== undefined ? args[i + 1] : '';
    if (k) obj[k] = v;
  }
  return JSON.stringify(obj);
};
