'use strict';

// $base64Encode[text]  — encode text to base64
module.exports = async (context, args) => {
  const text = String(args[0] ?? '');
  return Buffer.from(text, 'utf8').toString('base64');
};
