'use strict';
// $sliceText[text;start;end?]  — slices text from start to end (0-based)
module.exports = async (context, args) => {
  const text  = String(args[0] !== undefined ? args[0] : '');
  const start = args[1] !== undefined ? parseInt(args[1]) : 0;
  const end   = args[2] !== undefined ? parseInt(args[2]) : undefined;
  if (isNaN(start)) return '[error: $sliceText — start must be a number]';
  return end !== undefined && !isNaN(end) ? text.slice(start, end) : text.slice(start);
};
