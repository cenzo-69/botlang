'use strict';

const { argError } = require('../../core/fnError');

// $lockThread[threadID]
// Locks a thread so only moderators can send messages in it.
module.exports = async (context, args) => {
  const threadID = String(args[0] !== undefined ? args[0] : '').trim();

  if (!threadID) return argError(context, 'thread ID', 'Snowflake', threadID);
  if (!context.client) return '[error: $lockThread — no client available]';

  try {
    const thread = await context.client.channels.fetch(threadID);
    if (!thread || !thread.isThread()) return '[error: $lockThread — thread not found]';
    await thread.setLocked(true);
    return '';
  } catch (err) {
    return `[error: $lockThread — ${err.message}]`;
  }
};
