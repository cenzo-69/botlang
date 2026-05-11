'use strict';

// $vcMuteUser[userID;reason?]
// Server-mutes a member in their current voice channel.
module.exports = async (context, args) => {
  const userID = String(args[0] !== undefined ? args[0] : '').trim();
  const reason = String(args[1] !== undefined ? args[1] : '').trim() || 'No reason provided';

  if (!userID) return '[error: $vcMuteUser requires a userID]';
  if (!context.message?.guild) return '[error: $vcMuteUser — not in a guild]';

  try {
    const member = await context.message.guild.members.fetch(userID).catch(() => null);
    if (!member) return '[error: $vcMuteUser — member not found]';
    if (!member.voice.channel) return '[error: $vcMuteUser — user is not in a voice channel]';
    await member.voice.setMute(true, reason);
    return '';
  } catch (err) {
    return `[error: $vcMuteUser — ${err.message}]`;
  }
};
