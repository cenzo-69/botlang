'use strict';
// $inRange[number;min;max]  — returns "true" if number is between min and max (inclusive)
module.exports = async (context, args) => {
  const n   = parseFloat(args[0]);
  const min = parseFloat(args[1] !== undefined ? args[1] : '-Infinity');
  const max = parseFloat(args[2] !== undefined ? args[2] : 'Infinity');
  if (isNaN(n)) return '[error: $inRange — number must be valid]';
  return String(n >= min && n <= max);
};
