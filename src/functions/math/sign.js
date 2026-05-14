'use strict';

const { argError } = require('../../core/fnError');
// $sign[number]  — returns -1, 0, or 1 (sign of the number)
module.exports = async (context, args) => {
  const n = parseFloat(args[0]);
  if (isNaN(n)) return argError(context, 'n', 'number', n);
  return String(Math.sign(n));
};
