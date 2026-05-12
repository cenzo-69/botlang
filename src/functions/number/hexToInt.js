'use strict';
// $hexToInt[hex]  — converts hex color/number to integer
module.exports = async (context, args) => {
  const hex = String(args[0] !== undefined ? args[0] : '').replace(/^#/, '');
  const n = parseInt(hex, 16);
  if (isNaN(n)) return '[error: $hexToInt — invalid hex value]';
  return String(n);
};
