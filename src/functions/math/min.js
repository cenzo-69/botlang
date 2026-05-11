'use strict';

// $min[a;b;c;...]  — return the smallest number from the provided values
module.exports = async (context, args) => {
  if (!args.length) return '[min error: no arguments]';
  const nums = args.map(a => parseFloat(a));
  if (nums.some(isNaN)) return '[min error: non-numeric argument]';
  return String(Math.min(...nums));
};
