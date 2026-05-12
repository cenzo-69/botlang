'use strict';
// $trunc[number]  — returns the integer part, removing fractional digits
module.exports = async (context, args) => {
  const n = parseFloat(args[0]);
  if (isNaN(n)) return '[error: $trunc — argument must be a valid number]';
  return String(Math.trunc(n));
};
