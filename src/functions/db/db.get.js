'use strict';

const { argError } = require('../../core/fnError');

const db = require('../../core/db');

// $db.get[key;default?]  — read a persisted value; returns default if key is missing
module.exports = async (context, args) => {
  const key = args[0];
  const def = args[1] !== undefined ? args[1] : '';
  if (!key) return argError(context, 'key', 'string', key);
  const val = db.get(key, null);
  return val !== null ? String(val) : def;
};
