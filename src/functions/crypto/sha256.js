'use strict';
const crypto = require('crypto');
// $sha256[input;encoding?]  — creates SHA-256 hash. encoding: hex (default)|base64
module.exports = async (context, args) => {
  const input    = String(args[0] !== undefined ? args[0] : '');
  const encoding = String(args[1] !== undefined ? args[1] : 'hex').toLowerCase();
  return crypto.createHash('sha256').update(input).digest(encoding);
};
