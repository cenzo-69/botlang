'use strict';

const { argError } = require('../../core/fnError');

const db = require('../../core/db');

// $db.has[key]  — returns "true" if the key exists, "false" otherwise
module.exports = async (context, args) => {
  const key = args[0];
  if (!key) return argError(context, 'key', 'string', key);
  return String(db.has(key));
};
