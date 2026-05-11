'use strict';

// $vcUsers[channelID?;separator?]
// Returns a separated list of user IDs currently in a voice channel.
module.exports = async (context, args) => {
  const channelID = String(args[0] !== undefined ? args[0] : '').trim();
  const sep       = String(args[1] !== undefined ? args[1] : ', ');
  if (!context.client) return '[error: $vcUsers — no client]';

  try {
    let channel;
    if (channelID) {
      channel = await context.client.channels.fetch(channelID);
    } else {
      const author = context.message?.member;
      channel = author?.voice?.channel;
    }
    if (!channel) return '';
    return [...channel.members.keys()].join(sep);
  } catch (err) {
    return `[error: $vcUsers — ${err.message}]`;
  }
};
