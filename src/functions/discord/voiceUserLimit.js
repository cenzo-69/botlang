'use strict';

// $voiceUserLimit[voiceChannelID]
// Returns the user limit of a voice channel (0 = unlimited).
module.exports = async (context, args) => {
  const vcID = String(args[0] || '').trim();
  if (!vcID) return '[error: $voiceUserLimit requires a voice channel ID]';
  try {
    const channel = await context.client.channels.fetch(vcID);
    return String(channel.userLimit ?? 0);
  } catch (err) {
    return `[error: $voiceUserLimit — ${err.message}]`;
  }
};
