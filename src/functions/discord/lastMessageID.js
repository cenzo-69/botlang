'use strict';

// $lastMessageID[channelID?]
// Returns the ID of the most recent message in the channel (or current channel).
module.exports = async (context, args) => {
  const channelID = String(args[0] || '').trim();
  let channel = context.message?.channel;
  if (channelID) {
    try { channel = await context.client.channels.fetch(channelID); } catch { return '[error: Channel not found!]'; }
  }
  if (!channel) return '[error: No channel!]';
  try {
    const messages = await channel.messages.fetch({ limit: 1 });
    return messages.first()?.id ?? '';
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
