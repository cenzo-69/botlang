'use strict';
// $bigintMulti[a;b;...]  — multiplies multiple large integers using BigInt
module.exports = async (context, args) => {
  if (args.length < 2) return '[error: Requires at least 2 integers!]';
  try {
    return String(args.reduce((acc, a, i) => i === 0 ? BigInt(String(a).trim()) : acc * BigInt(String(a).trim())));
  } catch (err) {
    return `[error: Invalid integer: ${err.message}!]`;
  }
};
