'use strict';

// $ceil[number]  — round up to the nearest integer
module.exports = async (context, args) => {
  const n = parseFloat(args[0]);
  if (isNaN(n)) return '[ceil error: non-numeric argument]';
  return String(Math.ceil(n));
};
