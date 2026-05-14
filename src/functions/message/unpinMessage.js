'use strict';

const { argError } = require('../../core/fnError');

// $unpinMessage[messageID;channelID?;reason?]
// Unpins a message by ID.
module.exports = async (context, args) => {
  const messageID = String(args[0] !== undefined ? args[0] : '').trim();
  const channelID = String(args[1] !== undefined ? args[1] : '').trim();
  const reason    = String(args[2] !== undefined ? args[2] : '').trim() || 'Unpinned via bot';

  if (!messageID)  return argError(context, 'message ID', 'Snowflake', messageID);
  if (!context.client) return '[error: $unpinMessage — no client]';

  try {
    const ch = channelID
      ? await context.client.channels.fetch(channelID)
      : context.message?.channel;
    if (!ch) return '[error: $unpinMessage — channel not found]';
    const msg = await ch.messages.fetch(messageID);
    await msg.unpin(reason);
    return '';
  } catch (err) {
    return `[error: $unpinMessage — ${err.message}]`;
  }
};
