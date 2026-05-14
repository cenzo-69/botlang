'use strict';

const { argError } = require('../../core/fnError');
// $trunc[number]  — returns the integer part, removing fractional digits
module.exports = async (context, args) => {
  const n = parseFloat(args[0]);
  if (isNaN(n)) return argError(context, 'n', 'number', n);
  return String(Math.trunc(n));
};
