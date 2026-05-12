'use strict';
// $parseInt[value;radix?]  — parses string to integer with optional radix
module.exports = async (context, args) => {
  const val   = String(args[0] !== undefined ? args[0] : '');
  const radix = args[1] !== undefined ? parseInt(args[1]) : 10;
  const n = parseInt(val, radix);
  if (isNaN(n)) return '[error: $parseInt — could not parse value as integer]';
  return String(n);
};
