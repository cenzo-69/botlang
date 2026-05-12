'use strict';
const crypto = require('crypto');
// $encrypt[text;key]  — encrypts text using AES-256-CBC with the given key (hex output)
module.exports = async (context, args) => {
  const text = String(args[0] !== undefined ? args[0] : '');
  const key  = String(args[1] !== undefined ? args[1] : '');
  if (!key) return '[error: $encrypt — key is required. Usage: $encrypt[text;secretKey]]';
  try {
    const keyBuf = crypto.createHash('sha256').update(key).digest();
    const iv     = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', keyBuf, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  } catch (err) {
    return `[error: $encrypt — ${err.message}]`;
  }
};
