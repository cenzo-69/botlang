'use strict';

// $sqrt[number]  — square root of a number
module.exports = async (context, args) => {
  const n = parseFloat(args[0]);
  if (isNaN(n)) return '[sqrt error: non-numeric argument]';
  if (n < 0) return '[sqrt error: cannot take square root of negative number]';
  const result = Math.sqrt(n);
  return String(Number.isInteger(result) ? result : parseFloat(result.toFixed(10)));
};
