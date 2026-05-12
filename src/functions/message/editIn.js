'use strict';

// $editIn[timeMs;newContent]
// Schedules the bot's reply to be edited with new content after a delay.
// Sets the __edit_after__ flag as {ms, content} in context.
module.exports = async (context, args) => {
  const ms      = parseInt(args[0]) || 0;
  const content = String(args[1] !== undefined ? args[1] : '');
  if (ms > 0) context.variables.set('__edit_after__', { ms, content });
  return '';
};
