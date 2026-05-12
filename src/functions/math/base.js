'use strict';
// $base[number;to;from?]  — converts a number from one base to another
module.exports = async (context, args) => {
  const num  = String(args[0] !== undefined ? args[0] : '');
  const to   = parseInt(args[1]);
  const from = args[2] !== undefined ? parseInt(args[2]) : 10;
  if (!num) return '[error: $base — number is required]';
  if (isNaN(to) || to < 2 || to > 36) return '[error: $base — target base must be 2–36]';
  if (isNaN(from) || from < 2 || from > 36) return '[error: $base — source base must be 2–36]';
  const parsed = parseInt(num, from);
  if (isNaN(parsed)) return `[error: $base — "${num}" is not a valid base-${from} number]`;
  return parsed.toString(to).toUpperCase();
};
