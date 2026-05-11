'use strict';

// $vcBitrate[channelID?]
// Returns the bitrate (kbps) of a voice channel.
module.exports = async (context, args) => {
  const channelID = String(args[0] !== undefined ? args[0] : '').trim();
  if (!context.client) return '[error: $vcBitrate — no client]';

  try {
    let channel;
    if (channelID) {
      channel = await context.client.channels.fetch(channelID);
    } else {
      const member = context.message?.member;
      channel = member?.voice?.channel;
    }
    if (!channel) return '[error: $vcBitrate — channel not found]';
    return String(Math.floor((channel.bitrate || 0) / 1000));
  } catch (err) {
    return `[error: $vcBitrate — ${err.message}]`;
  }
};
