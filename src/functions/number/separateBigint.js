'use strict';
// $separateBigint[number;separator?]  — same as $separateNumber but handles BigInt strings
module.exports = async (context, args) => {
  const num = String(args[0] !== undefined ? args[0] : '').trim();
  const sep = args[1] !== undefined ? String(args[1]) : ',';
  if (!num || isNaN(num.replace(/[+-]/, ''))) return '[error: Invalid number!]';
  const sign  = num[0] === '-' ? '-' : '';
  const digits = num.replace(/^[+-]/, '');
  return sign + digits.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
};
