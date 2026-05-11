'use strict';

// $multi[a;b;c;...]  — multiply all provided numbers
module.exports = async (context, args) => {
  if (args.length < 2) return '[multi error: need at least 2 arguments]';
  const nums = args.map(a => parseFloat(a));
  if (nums.some(isNaN)) return '[multi error: non-numeric argument]';
  const result = nums.reduce((acc, n) => acc * n, 1);
  return String(Number.isInteger(result) ? result : parseFloat(result.toFixed(10)));
};
