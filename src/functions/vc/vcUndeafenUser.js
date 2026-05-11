'use strict';

// $vcUndeafenUser[userID;reason?]
// Removes server-deafen from a member in a voice channel.
module.exports = async (context, args) => {
  const userID = String(args[0] !== undefined ? args[0] : '').trim();
  const reason = String(args[1] !== undefined ? args[1] : '').trim() || 'No reason provided';

  if (!userID) return '[error: $vcUndeafenUser requires a userID]';
  if (!context.message?.guild) return '[error: $vcUndeafenUser — not in a guild]';

  try {
    const member = await context.message.guild.members.fetch(userID).catch(() => null);
    if (!member) return '[error: $vcUndeafenUser — member not found]';
    await member.voice.setDeaf(false, reason);
    return '';
  } catch (err) {
    return `[error: $vcUndeafenUser — ${err.message}]`;
  }
};
