'use strict';

const { argError } = require('../../core/fnError');
// $ordinal[number]  — appends ordinal suffix: 1st, 2nd, 3rd, 4th...
module.exports = async (context, args) => {
  const n = parseInt(args[0]);
  if (isNaN(n)) return argError(context, 'n', 'number', n);
  const abs = Math.abs(n);
  const mod100 = abs % 100;
  const mod10  = abs % 10;
  let suffix;
  if (mod100 >= 11 && mod100 <= 13) suffix = 'th';
  else if (mod10 === 1) suffix = 'st';
  else if (mod10 === 2) suffix = 'nd';
  else if (mod10 === 3) suffix = 'rd';
  else suffix = 'th';
  return n + suffix;
};
