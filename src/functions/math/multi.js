'use strict';

const fnError = require('../../core/fnError');

// $multi[a;b;c;...]  — multiply all provided numbers
module.exports = async (context, args) => {
  if (args.length < 2) {
    return fnError('multi', 'requires at least 2 arguments', {
      expected: 'two or more numeric values',
      example:  '$multi[5;4;3]',
    });
  }
  const nums = args.map(a => parseFloat(String(a)));
  const bad  = args.findIndex((_, i) => isNaN(nums[i]));
  if (bad !== -1) {
    return fnError('multi', `argument ${bad + 1} is not a valid number`, {
      got:      String(args[bad]),
      expected: 'a numeric value',
      example:  '$multi[5;4]',
    });
  }
  const result = nums.reduce((acc, n) => acc * n, 1);
  return String(Number.isInteger(result) ? result : parseFloat(result.toFixed(10)));
};
