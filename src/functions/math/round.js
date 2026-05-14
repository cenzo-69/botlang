'use strict';

const { argError } = require('../../core/fnError');

// $round[number;decimals?]
// Rounds a number to the specified decimal places (default 0).
module.exports = async (context, args) => {
  const num = parseFloat(args[0]);
  if (isNaN(num)) return argError(context, 'num', 'number', num);
  const decimals = Math.max(0, parseInt(args[1]) || 0);
  return String(Number(num.toFixed(decimals)));
};
