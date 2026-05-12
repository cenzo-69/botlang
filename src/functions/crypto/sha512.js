'use strict';
const crypto = require('crypto');
// $sha512[input;encoding?]  — creates SHA-512 hash. encoding: hex (default)|base64
module.exports = async (context, args) => {
  const input    = String(args[0] !== undefined ? args[0] : '');
  const encoding = String(args[1] !== undefined ? args[1] : 'hex').toLowerCase();
  return crypto.createHash('sha512').update(input).digest(encoding);
};
