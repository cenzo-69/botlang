'use strict';

const fnError = require('../../core/fnError');

// $clamp[value;min;max]  — clamp value to be between min and max
module.exports = async (context, args) => {
  if (args.length < 3) {
    return fnError('clamp', 'requires 3 arguments: value, min, max', {
      expected: 'three numeric values',
      example:  '$clamp[150;0;100]',
    });
  }
  const val = parseFloat(String(args[0]));
  const min = parseFloat(String(args[1]));
  const max = parseFloat(String(args[2]));
  if (isNaN(val)) return fnError('clamp', 'value is not a valid number', { got: String(args[0]), example: '$clamp[150;0;100]' });
  if (isNaN(min)) return fnError('clamp', 'min is not a valid number',   { got: String(args[1]), example: '$clamp[150;0;100]' });
  if (isNaN(max)) return fnError('clamp', 'max is not a valid number',   { got: String(args[2]), example: '$clamp[150;0;100]' });
  if (min > max)  return fnError('clamp', 'min cannot be greater than max', { got: `min=${min}, max=${max}`, example: '$clamp[50;0;100]' });
  return String(Math.min(Math.max(val, min), max));
};
