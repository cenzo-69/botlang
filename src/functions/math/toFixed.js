'use strict';

// $toFixed[number;decimals]  — format number to fixed decimal places
module.exports = async (context, args) => {
  const n    = parseFloat(args[0]);
  const dec  = parseInt(args[1] ?? '2');
  if (isNaN(n)) return '[toFixed error: not a number]';
  return n.toFixed(Math.max(0, dec));
};
