'use strict';
// $sign[number]  — returns -1, 0, or 1 (sign of the number)
module.exports = async (context, args) => {
  const n = parseFloat(args[0]);
  if (isNaN(n)) return '[error: $sign — argument must be a valid number]';
  return String(Math.sign(n));
};
