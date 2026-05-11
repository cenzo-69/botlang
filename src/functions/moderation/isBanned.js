'use strict';

// $isBanned[userID]
// Returns "true" if the user is currently banned from the guild.
module.exports = async (context, args) => {
  const userID = String(args[0] !== undefined ? args[0] : '').trim();
  if (!userID) return '[error: $isBanned requires a userID]';
  if (!context.message?.guild) return '[error: $isBanned — not in a guild]';

  try {
    await context.message.guild.bans.fetch(userID);
    return 'true';
  } catch {
    return 'false';
  }
};
