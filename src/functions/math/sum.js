'use strict';
// $sum[a;b;c;...]  — adds all numbers (alias for $add)
module.exports = async (context, args) => {
  const nums = args.map(a => parseFloat(a));
  if (!nums.length) return '[error: Requires at least one number!]';
  if (nums.some(isNaN)) return '[error: All arguments must be valid numbers!]';
  const result = nums.reduce((a, b) => a + b, 0);
  return String(Number.isInteger(result) ? result : parseFloat(result.toFixed(10)));
};
