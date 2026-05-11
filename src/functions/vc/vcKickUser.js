'use strict';

// $vcKickUser[userID;reason?]
// Disconnects a member from their current voice channel.
module.exports = async (context, args) => {
  const userID = String(args[0] !== undefined ? args[0] : '').trim();
  const reason = String(args[1] !== undefined ? args[1] : '').trim() || 'No reason provided';

  if (!userID) return '[error: $vcKickUser requires a userID]';
  if (!context.message?.guild) return '[error: $vcKickUser — not in a guild]';

  try {
    const member = await context.message.guild.members.fetch(userID).catch(() => null);
    if (!member) return '[error: $vcKickUser — member not found]';
    if (!member.voice.channel) return '[error: $vcKickUser — user is not in a voice channel]';
    await member.voice.disconnect(reason);
    return '';
  } catch (err) {
    return `[error: $vcKickUser — ${err.message}]`;
  }
};
