'use strict';

const fnError = require('../../core/fnError');

// $sqrt[number]  — square root of a number
module.exports = async (context, args) => {
  const raw = args[0] !== undefined ? String(args[0]).trim() : '';
  const n   = parseFloat(raw);
  if (isNaN(n)) {
    return fnError('sqrt', 'argument is not a valid number', {
      got:      raw || '(empty)',
      expected: 'a non-negative number',
      example:  '$sqrt[144]',
    });
  }
  if (n < 0) {
    return fnError('sqrt', 'cannot take the square root of a negative number', {
      got:     String(n),
      tip:     'Use `$abs[number]` first if you need the absolute value',
      example: '$sqrt[25]',
    });
  }
  const result = Math.sqrt(n);
  return String(Number.isInteger(result) ? result : parseFloat(result.toFixed(10)));
};
