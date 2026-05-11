'use strict';

// $loopNumber → current 1-based iteration number (inside $loop)
module.exports = async (context) => {
  if (context.loopIndex === null || context.loopIndex === undefined) return '[not in loop]';
  return String(context.loopIndex + 1);
};
