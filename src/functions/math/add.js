'use strict';

// $add[a;b;c;...]  — sum all provided numbers
module.exports = async (context, args) => {
  if (!args.length) return '[add error: no arguments]';
  const nums = args.map(a => parseFloat(a));
  if (nums.some(isNaN)) return '[add error: non-numeric argument]';
  const result = nums.reduce((sum, n) => sum + n, 0);
  return String(Number.isInteger(result) ? result : parseFloat(result.toFixed(10)));
};
