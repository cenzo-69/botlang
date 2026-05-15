'use strict';

// $vcUserCount[channelID?]
// Returns the number of members currently in a voice channel.
// Defaults to the current user's VC if no channelID is given.
module.exports = async (context, args) => {
  const channelID = String(args[0] !== undefined ? args[0] : '').trim();
  if (!context.client) return '[error: No client!]';

  try {
    let channel;
    if (channelID) {
      channel = await context.client.channels.fetch(channelID);
    } else {
      const member = context.message?.guild?.members?.me;
      channel = member?.voice?.channel;
    }
    if (!channel) return '0';
    return String(channel.members.size);
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
