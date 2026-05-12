'use strict';

// $replyIn[timeMs]
// Schedules the bot's reply to be sent after a delay.
// Sets the __reply_delay__ flag in context (your reply handler acts on it).
module.exports = async (context, args) => {
  const ms = parseInt(args[0]) || 0;
  if (ms > 0) context.variables.set('__reply_delay__', ms);
  return '';
};
