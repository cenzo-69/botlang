'use strict';

// $vcName[channelID?]
// Returns the name of a voice channel. Defaults to the author's current VC.
module.exports = async (context, args) => {
  const channelID = String(args[0] !== undefined ? args[0] : '').trim();
  if (!context.client) return '[error: $vcName — no client]';

  try {
    let channel;
    if (channelID) {
      channel = await context.client.channels.fetch(channelID);
    } else {
      const member = context.message?.member;
      channel = member?.voice?.channel;
    }
    if (!channel) return '[error: $vcName — channel not found]';
    return channel.name;
  } catch (err) {
    return `[error: $vcName — ${err.message}]`;
  }
};
