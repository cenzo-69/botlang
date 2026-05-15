'use strict';

const { argError } = require('../../core/fnError');
// $logn[number]  — natural logarithm (base e)
module.exports = async (context, args) => {
  const n = parseFloat(args[0]);
  if (isNaN(n)) return argError(context, 'n', 'number', n);
  if (n <= 0)   return '[error: Argument must be greater than 0!]';
  return String(parseFloat(Math.log(n).toFixed(10)));
};
