'use strict';

// $getSlowmode[(channelID)]
// Returns the slowmode delay in seconds for a channel (0 = no slowmode).
module.exports = async (context, args) => {
  const channelID = String(args[0] || '').trim();
  let channel = context.message?.channel;
  if (channelID) {
    try { channel = await context.client.channels.fetch(channelID); } catch { return '[error: channel not found]'; }
  }
  if (!channel) return '[error: no channel]';
  return String(channel.rateLimitPerUser ?? 0);
};
