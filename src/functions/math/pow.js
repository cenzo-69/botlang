'use strict';

const fnError = require('../../core/fnError');

// $pow[base;exponent]  — base raised to exponent
module.exports = async (context, args) => {
  if (args.length < 2) {
    return fnError('pow', 'requires 2 arguments: base and exponent', {
      expected: 'two numeric values',
      example:  '$pow[2;10]',
    });
  }
  const base = parseFloat(String(args[0]));
  const exp  = parseFloat(String(args[1]));
  if (isNaN(base)) return fnError('pow', 'base is not a valid number', { got: String(args[0]), example: '$pow[2;10]' });
  if (isNaN(exp))  return fnError('pow', 'exponent is not a valid number', { got: String(args[1]), example: '$pow[2;10]' });
  return String(Math.pow(base, exp));
};
