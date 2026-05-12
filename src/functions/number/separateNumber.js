'use strict';
// $separateNumber[number;separator?]  — formats number with thousands separator
module.exports = async (context, args) => {
  const n   = parseFloat(args[0]);
  const sep = args[1] !== undefined ? String(args[1]) : ',';
  if (isNaN(n)) return '[error: $separateNumber — argument must be a valid number]';
  const parts = n.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, sep);
  return parts.join('.');
};
