'use strict';

const db = require('../core/db');

// $db.has[key]  — returns "true" if the key exists, "false" otherwise
module.exports = async (context, args) => {
  const key = args[0];
  if (!key) return '[error: $db.has requires a key]';
  return String(db.has(key));
};
