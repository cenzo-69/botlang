'use strict';
// $logn[number]  — natural logarithm (base e)
module.exports = async (context, args) => {
  const n = parseFloat(args[0]);
  if (isNaN(n)) return '[error: $logn — argument must be a valid number]';
  if (n <= 0)   return '[error: $logn — argument must be greater than 0]';
  return String(parseFloat(Math.log(n).toFixed(10)));
};
