'use strict';

// $space        → single space
// $space[N]     → N spaces
module.exports = async (context, args) => {
  const n = Math.min(Math.max(parseInt(args[0]) || 1, 1), 100);
  return ' '.repeat(n);
};
