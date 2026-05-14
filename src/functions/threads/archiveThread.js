'use strict';

const { argError } = require('../../core/fnError');

// $archiveThread[threadID]
// Archives a thread channel by ID.
module.exports = async (context, args) => {
  const threadID = String(args[0] !== undefined ? args[0] : '').trim();

  if (!threadID) return argError(context, 'thread ID', 'Snowflake', threadID);
  if (!context.client) return '[error: $archiveThread — no client available]';

  try {
    const thread = await context.client.channels.fetch(threadID);
    if (!thread || !thread.isThread()) return '[error: $archiveThread — thread not found]';
    await thread.setArchived(true);
    return '';
  } catch (err) {
    return `[error: $archiveThread — ${err.message}]`;
  }
};
