'use strict';

// $repeat[text;count]           → text repeated N times
// $repeat[text;count;separator] → joined by separator
module.exports = async (context, args) => {
  const text  = String(args[0] || '');
  const count = Math.min(Math.max(parseInt(args[1]) || 0, 0), 1000);
  const sep   = args[2] !== undefined ? String(args[2]) : '';

  if (count === 0) return '';
  return Array(count).fill(text).join(sep);
};
