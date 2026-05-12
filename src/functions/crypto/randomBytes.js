'use strict';
const crypto = require('crypto');
// $randomBytes[length]  — generates a hex string of random bytes
module.exports = async (context, args) => {
  const len = parseInt(args[0]);
  if (isNaN(len) || len < 1) return '[error: $randomBytes — length must be a positive integer]';
  if (len > 4096) return '[error: $randomBytes — maximum length is 4096]';
  return crypto.randomBytes(len).toString('hex');
};
