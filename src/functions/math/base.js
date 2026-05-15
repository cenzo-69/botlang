'use strict';

const { argError } = require('../../core/fnError');
// $base[number;to;from?]  — converts a number from one base to another
module.exports = async (context, args) => {
  const num  = String(args[0] !== undefined ? args[0] : '');
  const to   = parseInt(args[1]);
  const from = args[2] !== undefined ? parseInt(args[2]) : 10;
  if (!num) return argError(context, 'num', 'number', num);
  if (isNaN(to) || to < 2 || to > 36) return '[error: Target base must be 2–36!]';
  if (isNaN(from) || from < 2 || from > 36) return '[error: Source base must be 2–36!]';
  const parsed = parseInt(num, from);
  if (isNaN(parsed)) return `[error: "${num}" is not a valid base-${from} number!]`;
  return parsed.toString(to).toUpperCase();
};
