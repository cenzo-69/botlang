'use strict';
// $randomNumber[min;max;decimals?]  — random float between min and max
module.exports = async (context, args) => {
  const min      = parseFloat(args[0] !== undefined ? args[0] : 0);
  const max      = parseFloat(args[1] !== undefined ? args[1] : 1);
  const decimals = args[2] !== undefined ? parseInt(args[2]) : 0;
  if (isNaN(min) || isNaN(max)) return '[error: Min and max must be valid numbers!]';
  if (max < min) return '[error: Max must be >= min!]';
  const n = Math.random() * (max - min) + min;
  return String(decimals > 0 ? parseFloat(n.toFixed(decimals)) : Math.floor(n));
};
