'use strict';
// $bigintSum[a;b;...]  — adds multiple large integers using BigInt
module.exports = async (context, args) => {
  try {
    return String(args.reduce((acc, a) => acc + BigInt(String(a).trim()), 0n));
  } catch (err) {
    return `[error: Invalid integer: ${err.message}!]`;
  }
};
