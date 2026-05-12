'use strict';

// $percentage[value;total;decimals?]  — what % is value of total
module.exports = async (context, args) => {
  const value   = parseFloat(args[0]);
  const total   = parseFloat(args[1]);
  const dec     = parseInt(args[2] ?? '2');
  if (isNaN(value) || isNaN(total)) return '[percentage error: invalid number]';
  if (total === 0) return '0';
  return ((value / total) * 100).toFixed(Math.max(0, dec));
};
