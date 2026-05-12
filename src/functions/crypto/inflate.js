'use strict';
const zlib = require('zlib');
const { promisify } = require('util');
const inflateAsync = promisify(zlib.inflate);
// $inflate[input;encoding?]  — decompresses deflate input. encoding: base64 (default)|hex
module.exports = async (context, args) => {
  const input    = String(args[0] !== undefined ? args[0] : '');
  const encoding = String(args[1] !== undefined ? args[1] : 'base64').toLowerCase();
  try {
    const buf = Buffer.from(input, encoding === 'hex' ? 'hex' : 'base64');
    const out = await inflateAsync(buf);
    return out.toString('utf8');
  } catch (err) {
    return `[error: $inflate — ${err.message}]`;
  }
};
