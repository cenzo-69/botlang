'use strict';

// $threadMessageCount
// Returns the approximate message count in the current thread.
module.exports = async (context, args) => {
  const channel = context.message?.channel;
  if (!channel?.isThread?.()) return '[error: Not in a thread!]';
  return String(channel.messageCount ?? 0);
};
