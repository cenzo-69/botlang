'use strict';

// $clamp[value;min;max]  — clamp value between min and max
module.exports = async (context, args) => {
  const val = parseFloat(args[0]);
  const min = parseFloat(args[1]);
  const max = parseFloat(args[2]);
  if ([val, min, max].some(isNaN)) return '[clamp error: invalid number]';
  return String(Math.min(Math.max(val, min), max));
};
