'use strict';

// $getBanReason[userID;(guildID)]
// Returns the ban reason for a user, or empty string if no reason was given.
module.exports = async (context, args) => {
  const userID  = String(args[0] || '').trim();
  const guildID = String(args[1] || '').trim();
  if (!userID) return '[error: $getBanReason requires a userID]';
  let guild = context.message?.guild;
  if (guildID) {
    try { guild = await context.client.guilds.fetch(guildID); } catch { return '[error: guild not found]'; }
  }
  if (!guild) return '[error: no guild]';
  try {
    const ban = await guild.bans.fetch(userID);
    return ban.reason ?? '';
  } catch (err) {
    return `[error: $getBanReason — ${err.message}]`;
  }
};
