'use strict';

// $numberSeparator[number;sep?]
// Format a number with thousands separators.
// Default separator: ,   Example: $numberSeparator[1000000]  → 1,000,000
module.exports = async (context, args) => {
  const raw = String(args[0] || '').trim();
  const sep = args[1] !== undefined ? String(args[1]) : ',';
  const n   = parseFloat(raw);
  if (isNaN(n)) return raw;

  const [intPart, decPart] = n.toFixed(10).replace(/\.?0+$/, '').split('.');
  const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
  return decPart ? `${formatted}.${decPart}` : formatted;
};
