'use strict';

// $setChannelNSFW[true/false;channelID?;reason?]
// Marks or unmarks a channel as age-restricted (NSFW).
module.exports = async (context, args) => {
  const nsfw      = String(args[0] !== undefined ? args[0] : '').trim().toLowerCase() === 'true';
  const channelID = String(args[1] !== undefined ? args[1] : '').trim();
  const reason    = String(args[2] !== undefined ? args[2] : '').trim() || 'No reason provided';

  if (!context.client) return '[error: $setChannelNSFW — no client]';

  try {
    const channel = channelID
      ? await context.client.channels.fetch(channelID)
      : context.message?.channel;
    if (!channel) return '[error: $setChannelNSFW — channel not found]';
    await channel.setNSFW(nsfw, reason);
    return '';
  } catch (err) {
    return `[error: $setChannelNSFW — ${err.message}]`;
  }
};
