'use strict';

const db = require('../core/db');

// $db.delete[key]  — remove a key from persistent storage
module.exports = async (context, args) => {
  const key = args[0];
  if (!key) return '[error: $db.delete requires a key]';
  db.delete(key);
  return '';
};
