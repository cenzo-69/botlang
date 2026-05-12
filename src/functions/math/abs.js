'use strict';

// $abs[number]  — absolute value
module.exports = async (context, args) => {
  const n = parseFloat(args[0]);
  if (isNaN(n)) return '[abs error: not a number]';
  return String(Math.abs(n));
};
