'use strict';

const { argError } = require('../../core/fnError');

// $threadAddMember[threadID;userID]
// Adds a member to a thread, allowing them to view and post in it.
module.exports = async (context, args) => {
  const threadID = String(args[0] !== undefined ? args[0] : '').trim();
  const userID   = String(args[1] !== undefined ? args[1] : '').trim();
  if (!threadID) return argError(context, 'thread ID', 'Snowflake', threadID);
  if (!userID)   return argError(context, 'user ID', 'Snowflake', userID);
  if (!context.client) return '[error: $threadAddMember — no client]';

  try {
    const thread = await context.client.channels.fetch(threadID);
    if (!thread?.isThread()) return '[error: $threadAddMember — channel is not a thread]';
    await thread.members.add(userID);
    return '';
  } catch (err) {
    return `[error: $threadAddMember — ${err.message}]`;
  }
};
