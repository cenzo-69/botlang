'use strict';

const fnError = require('../../core/fnError');

// $mod[a;b]  — remainder of a divided by b
module.exports = async (context, args) => {
  if (args.length < 2) {
    return fnError('mod', 'requires exactly 2 arguments', {
      expected: 'two numeric values',
      example:  '$mod[17;5]',
    });
  }
  const a = parseFloat(String(args[0]));
  const b = parseFloat(String(args[1]));
  if (isNaN(a)) return fnError('mod', 'first argument is not a valid number', { got: String(args[0]), example: '$mod[17;5]' });
  if (isNaN(b)) return fnError('mod', 'second argument is not a valid number', { got: String(args[1]), example: '$mod[17;5]' });
  if (b === 0)  return fnError('mod', 'division by zero — second argument cannot be 0', { tip: 'Use a non-zero divisor', example: '$mod[17;5]' });
  return String(a % b);
};
