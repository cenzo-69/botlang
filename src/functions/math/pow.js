'use strict';

// $pow[base;exponent]  — base raised to exponent
module.exports = async (context, args) => {
  const base = parseFloat(args[0]);
  const exp  = parseFloat(args[1]);
  if (isNaN(base) || isNaN(exp)) return '[pow error: invalid number]';
  return String(Math.pow(base, exp));
};
