'use strict';
// $bigintSub[a;b;...]  — subtracts BigInts left to right
module.exports = async (context, args) => {
  if (args.length < 2) return '[error: $bigintSub — requires at least 2 integers]';
  try {
    return String(args.reduce((acc, a, i) => i === 0 ? BigInt(String(a).trim()) : acc - BigInt(String(a).trim())));
  } catch (err) {
    return `[error: $bigintSub — invalid integer: ${err.message}]`;
  }
};
