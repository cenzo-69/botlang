'use strict';
const crypto = require('crypto');
// $md5[input;encoding?]  — creates MD5 hash. encoding: hex (default)|base64|binary
module.exports = async (context, args) => {
  const input    = String(args[0] !== undefined ? args[0] : '');
  const encoding = String(args[1] !== undefined ? args[1] : 'hex').toLowerCase();
  return crypto.createHash('md5').update(input).digest(encoding);
};
