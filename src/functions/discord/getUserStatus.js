'use strict';

// $getUserStatus[userID]
// Returns the presence status of a guild member: online | idle | dnd | offline.
// Requires GuildPresences intent to be enabled on the client.
module.exports = async (context, args) => {
  const userID = String(args[0] || '').trim() || context.message?.author?.id;
  if (!context.message?.guild) return '[error: no guild]';
  try {
    const member = await context.message.guild.members.fetch(userID);
    return member.presence?.status ?? 'offline';
  } catch {
    return 'offline';
  }
};
