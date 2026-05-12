'use strict';

// $deleteIn[timeMs]
// Schedules the bot's reply message to be deleted after a delay.
// Sets the __delete_after__ flag in context (your reply handler acts on it).
module.exports = async (context, args) => {
  const ms = parseInt(args[0]) || 0;
  if (ms > 0) context.variables.set('__delete_after__', ms);
  return '';
};
