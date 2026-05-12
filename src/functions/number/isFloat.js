'use strict';
// $isFloat[value]  — returns "true" if value is a non-integer finite number
module.exports = async (context, args) => {
  const n = parseFloat(args[0]);
  return String(isFinite(n) && !Number.isInteger(n));
};
