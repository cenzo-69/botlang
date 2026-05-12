'use strict';
// $abbreviateNumber[number]  — shortens large numbers (1000 → 1K, 1000000 → 1M)
module.exports = async (context, args) => {
  const n = parseFloat(args[0]);
  if (isNaN(n)) return '[error: $abbreviateNumber — argument must be a valid number]';
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1e12) return sign + parseFloat((abs / 1e12).toFixed(2)) + 'T';
  if (abs >= 1e9)  return sign + parseFloat((abs / 1e9).toFixed(2)) + 'B';
  if (abs >= 1e6)  return sign + parseFloat((abs / 1e6).toFixed(2)) + 'M';
  if (abs >= 1e3)  return sign + parseFloat((abs / 1e3).toFixed(2)) + 'K';
  return String(n);
};
