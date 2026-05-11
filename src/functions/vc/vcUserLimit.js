'use strict';

// $vcUserLimit[channelID?]
// Returns the user limit of a voice channel. 0 means unlimited.
module.exports = async (context, args) => {
  const channelID = String(args[0] !== undefined ? args[0] : '').trim();
  if (!context.client) return '[error: $vcUserLimit — no client]';

  try {
    let channel;
    if (channelID) {
      channel = await context.client.channels.fetch(channelID);
    } else {
      const member = context.message?.member;
      channel = member?.voice?.channel;
    }
    if (!channel) return '[error: $vcUserLimit — channel not found]';
    return String(channel.userLimit || 0);
  } catch (err) {
    return `[error: $vcUserLimit — ${err.message}]`;
  }
};
