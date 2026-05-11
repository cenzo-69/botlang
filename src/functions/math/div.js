'use strict';

// $div[a;b]  — divide a by b
module.exports = async (context, args) => {
  if (args.length < 2) return '[div error: need 2 arguments]';
  const a = parseFloat(args[0]);
  const b = parseFloat(args[1]);
  if (isNaN(a) || isNaN(b)) return '[div error: non-numeric argument]';
  if (b === 0) return '[div error: division by zero]';
  const result = a / b;
  return String(Number.isInteger(result) ? result : parseFloat(result.toFixed(10)));
};
