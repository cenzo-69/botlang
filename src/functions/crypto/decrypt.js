'use strict';
const crypto = require('crypto');
// $decrypt[encryptedText;key]  — decrypts text encrypted by $encrypt
module.exports = async (context, args) => {
  const text = String(args[0] !== undefined ? args[0] : '');
  const key  = String(args[1] !== undefined ? args[1] : '');
  if (!key) return '[error: $decrypt — key is required]';
  if (!text.includes(':')) return '[error: $decrypt — invalid encrypted format. Must be output from $encrypt]';
  try {
    const [ivHex, encHex] = text.split(':');
    const keyBuf   = crypto.createHash('sha256').update(key).digest();
    const iv       = Buffer.from(ivHex, 'hex');
    const enc      = Buffer.from(encHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuf, iv);
    return Buffer.concat([decipher.update(enc), decipher.final()]).toString('utf8');
  } catch (err) {
    return `[error: $decrypt — decryption failed: ${err.message}]`;
  }
};
