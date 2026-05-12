'use strict';

const fnError = require('../../core/fnError');

// $sub[a;b;c;...]  — subtract b, c, ... from a
module.exports = async (context, args) => {
  if (args.length < 2) {
    return fnError('sub', 'requires at least 2 arguments', {
      expected: 'two or more numeric values',
      example:  '$sub[100;40;10]',
    });
  }
  const nums = args.map(a => parseFloat(String(a)));
  const bad  = args.findIndex((_, i) => isNaN(nums[i]));
  if (bad !== -1) {
    return fnError('sub', `argument ${bad + 1} is not a valid number`, {
      got:      String(args[bad]),
      expected: 'a numeric value',
      example:  '$sub[100;40]',
    });
  }
  const result = nums.slice(1).reduce((acc, n) => acc - n, nums[0]);
  return String(Number.isInteger(result) ? result : parseFloat(result.toFixed(10)));
};
