'use strict';

// $threadUserCount
// Returns the approximate number of members in the current thread.
module.exports = async (context, args) => {
  const channel = context.message?.channel;
  if (!channel?.isThread?.()) return '[error: $threadUserCount — not in a thread]';
  return String(channel.memberCount ?? 0);
};
