'use strict';

// $loopIndex → current 0-based iteration index (inside $loop)
module.exports = async (context) => {
  if (context.loopIndex === null || context.loopIndex === undefined) return '[not in loop]';
  return String(context.loopIndex);
};
