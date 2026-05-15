'use strict';

const { argError } = require('../../core/fnError');
const db = require('../../core/db');

// $db.set[key;value]  — persist a value under key (PostgreSQL-backed)
module.exports = async (context, args) => {
  const key   = args[0];
  const value = args[1] !== undefined ? args[1] : '';
  if (!key) return argError(context, 'key', 'string', key);
  await db.set(key, value);
  return '';
};
