'use strict';

const { argError } = require('../../core/fnError');
// $unparseDate[dateString]  — converts date string to Unix milliseconds
module.exports = async (context, args) => {
  const str = String(args[0] !== undefined ? args[0] : '').trim();
  if (!str) return argError(context, 'str', 'string', str);
  const ts = Date.parse(str);
  if (isNaN(ts)) return `[error: $unparseDate — could not parse date: "${str}"]`;
  return String(ts);
};
