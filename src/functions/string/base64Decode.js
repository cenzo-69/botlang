'use strict';

// $base64Decode[base64text]  — decode base64 back to text
module.exports = async (context, args) => {
  const text = String(args[0] ?? '');
  try {
    return Buffer.from(text, 'base64').toString('utf8');
  } catch {
    return '[base64Decode error: invalid base64]';
  }
};
