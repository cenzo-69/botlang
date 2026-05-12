'use strict';

const fnError = require('../../core/fnError');

// $divide[a;b;c;...]  — divides numbers left to right
module.exports = async (context, args) => {
  if (args.length < 2) {
    return fnError('divide', 'requires at least 2 arguments', {
      expected: 'two or more numeric values',
      example:  '$divide[100;5;2]',
    });
  }

  const nums = args.map(a => parseFloat(String(a)));
  const bad  = args.findIndex((_, i) => isNaN(nums[i]));
  if (bad !== -1) {
    return fnError('divide', `argument ${bad + 1} is not a valid number`, {
      got:      String(args[bad]),
      expected: 'a numeric value',
      example:  '$divide[100;5]',
    });
  }

  const zeroIdx = nums.slice(1).findIndex(n => n === 0);
  if (zeroIdx !== -1) {
    return fnError('divide', `division by zero at argument ${zeroIdx + 2}`, {
      tip:     'Make sure no divisor is 0',
      example: '$divide[100;4]',
    });
  }

  const result = nums.reduce((acc, n, i) => i === 0 ? n : acc / n);
  return String(Number.isInteger(result) ? result : parseFloat(result.toFixed(10)));
};
