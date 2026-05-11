'use strict';

// $sub[a;b;c;...]  — subtract b, c, ... from a
module.exports = async (context, args) => {
  if (args.length < 2) return '[sub error: need at least 2 arguments]';
  const nums = args.map(a => parseFloat(a));
  if (nums.some(isNaN)) return '[sub error: non-numeric argument]';
  const result = nums.slice(1).reduce((acc, n) => acc - n, nums[0]);
  return String(Number.isInteger(result) ? result : parseFloat(result.toFixed(10)));
};
