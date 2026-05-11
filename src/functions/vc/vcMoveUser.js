'use strict';

// $vcMoveUser[userID;channelID;reason?]
// Moves a member to a different voice channel.
module.exports = async (context, args) => {
  const userID    = String(args[0] !== undefined ? args[0] : '').trim();
  const channelID = String(args[1] !== undefined ? args[1] : '').trim();
  const reason    = String(args[2] !== undefined ? args[2] : '').trim() || 'No reason provided';

  if (!userID)    return '[error: $vcMoveUser requires a userID]';
  if (!channelID) return '[error: $vcMoveUser requires a channelID]';
  if (!context.message?.guild) return '[error: $vcMoveUser — not in a guild]';

  try {
    const member = await context.message.guild.members.fetch(userID).catch(() => null);
    if (!member) return '[error: $vcMoveUser — member not found]';
    await member.voice.setChannel(channelID, reason);
    return '';
  } catch (err) {
    return `[error: $vcMoveUser — ${err.message}]`;
  }
};
