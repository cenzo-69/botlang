'use strict';

// $mod[a;b]  — remainder of a divided by b
module.exports = async (context, args) => {
  if (args.length < 2) return '[mod error: need 2 arguments]';
  const a = parseFloat(args[0]);
  const b = parseFloat(args[1]);
  if (isNaN(a) || isNaN(b)) return '[mod error: non-numeric argument]';
  if (b === 0) return '[mod error: division by zero]';
  return String(a % b);
};
