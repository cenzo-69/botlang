'use strict';

// $repeatMessage[amount;message]
// Sends a message to the current channel multiple times.
// Returns empty string.
module.exports = async (context, args) => {
  const amount  = Math.min(Math.max(parseInt(args[0]) || 1, 1), 10);
  const content = String(args[1] !== undefined ? args[1] : '');
  if (!content) return '[error: $repeatMessage requires a message!]';
  if (!context.message?.channel) return '[error: No channel context!]';

  for (let i = 0; i < amount; i++) {
    await context.message.channel.send({ content }).catch(() => {});
  }
  return '';
};
