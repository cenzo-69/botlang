'use strict';

// $slice[text;start;end]   → substring from start to end (0-based, end optional)
module.exports = async (context, args) => {
  const text  = String(args[0] || '');
  const start = parseInt(args[1]) || 0;
  const end   = args[2] !== undefined ? parseInt(args[2]) : undefined;
  return isNaN(end) || end === undefined ? text.slice(start) : text.slice(start, end);
};
