'use strict';

const fnError = require('../../core/fnError');

// $add[a;b;c;...]  — sums all provided numbers
module.exports = async (context, args) => {
  if (!args.length) {
    return fnError('add', 'no arguments provided', {
      expected: 'one or more numeric values',
      example:  '$add[10;20;5]',
    });
  }

  const nums = args.map(a => parseFloat(String(a)));
  const bad  = args.findIndex((_, i) => isNaN(nums[i]));
  if (bad !== -1) {
    return fnError('add', `argument ${bad + 1} is not a valid number`, {
      got:      String(args[bad]),
      expected: 'a numeric value',
      example:  '$add[10;20;5]',
    });
  }

  const result = nums.reduce((s, n) => s + n, 0);
  return String(Number.isInteger(result) ? result : parseFloat(result.toFixed(10)));
};
