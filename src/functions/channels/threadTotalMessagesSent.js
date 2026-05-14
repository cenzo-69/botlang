'use strict';

const { argError } = require('../../core/fnError');
// $threadTotalMessagesSent[channelID]  — returns total messages sent in a thread (ever)
module.exports = async (context, args) => {
  const id = String(args[0] !== undefined ? args[0] : '').trim();
  if (!id) return argError(context, 'id', 'string', id);
  try {
    const ch = await context.client?.channels.fetch(id);
    if (!ch) return '[error: $threadTotalMessagesSent — thread not found]';
    return String(ch.totalMessageSent ?? ch.messageCount ?? 0);
  } catch (err) { return `[error: $threadTotalMessagesSent — ${err.message}]`; }
};
