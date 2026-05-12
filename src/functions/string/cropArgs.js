'use strict';
// $cropArgs[args;startIndex;endIndex?]  — crops space-separated args from startIndex to endIndex
module.exports = async (context, args) => {
  const text  = String(args[0] !== undefined ? args[0] : '');
  const start = parseInt(args[1]) || 0;
  const end   = args[2] !== undefined ? parseInt(args[2]) : undefined;
  const parts = text.trim().split(/\s+/);
  return (end !== undefined ? parts.slice(start, end) : parts.slice(start)).join(' ');
};
