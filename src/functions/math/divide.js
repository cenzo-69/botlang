'use strict';
// $divide[a;b;c;...]  — divides numbers left to right
module.exports = async (context, args) => {
  if (args.length < 2) return '[error: $divide — requires at least 2 numbers]';
  const nums = args.map(a => parseFloat(a));
  if (nums.some(isNaN)) return '[error: $divide — all arguments must be valid numbers]';
  if (nums.slice(1).some(n => n === 0)) return '[error: $divide — division by zero]';
  const result = nums.reduce((acc, n, i) => i === 0 ? n : acc / n);
  return String(Number.isInteger(result) ? result : parseFloat(result.toFixed(10)));
};
