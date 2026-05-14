'use strict';

const { argError } = require('../../core/fnError');

// $threadRemoveMember[threadID;userID]
// Removes a member from a thread.
module.exports = async (context, args) => {
  const threadID = String(args[0] !== undefined ? args[0] : '').trim();
  const userID   = String(args[1] !== undefined ? args[1] : '').trim();
  if (!threadID) return argError(context, 'thread ID', 'Snowflake', threadID);
  if (!userID)   return argError(context, 'user ID', 'Snowflake', userID);
  if (!context.client) return '[error: $threadRemoveMember — no client]';

  try {
    const thread = await context.client.channels.fetch(threadID);
    if (!thread?.isThread()) return '[error: $threadRemoveMember — channel is not a thread]';
    await thread.members.remove(userID);
    return '';
  } catch (err) {
    return `[error: $threadRemoveMember — ${err.message}]`;
  }
};
