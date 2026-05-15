'use strict';

const { argError } = require('../../core/fnError');
const db = require('../../core/db');

// $db.delete[key]  — remove a key from persistent storage (PostgreSQL-backed)
module.exports = async (context, args) => {
  const key = args[0];
  if (!key) return argError(context, 'key', 'string', key);
  await db.delete(key);
  return '';
};
