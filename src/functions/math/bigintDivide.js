'use strict';
// $bigintDivide[a;b;...]  — integer-divides BigInts left to right
module.exports = async (context, args) => {
  if (args.length < 2) return '[error: Requires at least 2 integers!]';
  try {
    return String(args.reduce((acc, a, i) => {
      if (i === 0) return BigInt(String(a).trim());
      const divisor = BigInt(String(a).trim());
      if (divisor === 0n) throw new Error('division by zero');
      return acc / divisor;
    }));
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
