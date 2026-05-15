'use strict';

// $vcRegion[channelID?]
// Returns the RTC region of a voice channel ("automatic" if not set).
// Defaults to the author's current VC.
module.exports = async (context, args) => {
  const channelID = String(args[0] !== undefined ? args[0] : '').trim();
  if (!context.client) return '[error: No client!]';

  try {
    let channel;
    if (channelID) {
      channel = await context.client.channels.fetch(channelID);
    } else {
      const member = context.message?.member;
      channel = member?.voice?.channel;
    }
    if (!channel) return '[error: Channel not found!]';
    return channel.rtcRegion ?? 'automatic';
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
