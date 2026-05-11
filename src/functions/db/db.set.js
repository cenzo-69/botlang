'use strict';

const db = require('../../core/db');

// $db.set[key;value]  — persist a value under key
module.exports = async (context, args) => {
  const key   = args[0];
  const value = args[1] !== undefined ? args[1] : '';
  if (!key) return '[error: $db.set requires a key]';
  db.set(key, value);
  return '';
};
