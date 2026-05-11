'use strict';

// $floor[number]  — round down to the nearest integer
module.exports = async (context, args) => {
  const n = parseFloat(args[0]);
  if (isNaN(n)) return '[floor error: non-numeric argument]';
  return String(Math.floor(n));
};
