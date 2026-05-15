'use strict';

const { argError } = require('../../core/fnError');

// $messageEditedTimestamp[channelID;messageID]
// Returns the ISO 8601 timestamp of when the message was last edited, or empty if not edited.
module.exports = async (context, args) => {
  const channelID = String(args[0] || '').trim();
  const messageID = String(args[1] || '').trim();
  if (!channelID || !messageID) return argError(context, 'channel ID', 'TextChannel', channelID);
  try {
    const channel = await context.client.channels.fetch(channelID);
    const msg     = await channel.messages.fetch(messageID);
    return msg.editedAt ? msg.editedAt.toISOString() : '';
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
