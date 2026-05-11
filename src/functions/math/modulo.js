'use strict';

// $modulo[a;b]  — alias for $mod[a;b]
module.exports = async (context, args) => {
  if (args.length < 2) return '[modulo error: need 2 arguments]';
  const a = parseFloat(args[0]);
  const b = parseFloat(args[1]);
  if (isNaN(a) || isNaN(b)) return '[modulo error: non-numeric argument]';
  if (b === 0) return '[modulo error: division by zero]';
  return String(a % b);
};
