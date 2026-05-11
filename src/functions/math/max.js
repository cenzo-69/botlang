'use strict';

// $max[a;b;c;...]  — return the largest number from the provided values
module.exports = async (context, args) => {
  if (!args.length) return '[max error: no arguments]';
  const nums = args.map(a => parseFloat(a));
  if (nums.some(isNaN)) return '[max error: non-numeric argument]';
  return String(Math.max(...nums));
};
