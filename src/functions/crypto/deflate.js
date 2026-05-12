'use strict';
const zlib = require('zlib');
const { promisify } = require('util');
const deflateAsync = promisify(zlib.deflate);
// $deflate[input;encoding?]  — compresses input using deflate. encoding: base64 (default)|hex
module.exports = async (context, args) => {
  const input    = String(args[0] !== undefined ? args[0] : '');
  const encoding = String(args[1] !== undefined ? args[1] : 'base64').toLowerCase();
  try {
    const buf = await deflateAsync(Buffer.from(input, 'utf8'));
    return buf.toString(encoding === 'hex' ? 'hex' : 'base64');
  } catch (err) {
    return `[error: $deflate — ${err.message}]`;
  }
};
