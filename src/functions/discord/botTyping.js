'use strict';

// $botTyping[channelID?]
// Triggers the "Bot is typing..." indicator in a channel.
module.exports = async (context, args) => {
  const channelID = String(args[0] !== undefined ? args[0] : '').trim();
  if (!context.client) return '';

  try {
    const channel = channelID
      ? await context.client.channels.fetch(channelID)
      : context.message?.channel;
    if (!channel) return '';
    await channel.sendTyping();
  } catch { /* silently ignore */ }
  return '';
};
