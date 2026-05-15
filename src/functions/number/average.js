'use strict';
// $average[separator;num1;num2;...]  — average of numbers split by separator
module.exports = async (context, args) => {
  const sep  = String(args[0] !== undefined ? args[0] : ',');
  const rest = args.slice(1).join(sep);
  const nums = rest.split(sep).map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
  if (!nums.length) return '[error: No valid numbers provided!]';
  return String(parseFloat((nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(10)));
};
