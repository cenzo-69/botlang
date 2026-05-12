'use strict';
// $memberBoostingSince[guildID;userID?]  — ISO date when member started boosting, or empty string
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  const userID  = String(args[1] !== undefined ? args[1] : '').trim() || context.message?.author?.id;
  if (!guildID) return '[error: $memberBoostingSince — guildID is required]';
  try {
    const guild  = await context.client?.guilds.fetch(guildID);
    const member = await guild?.members.fetch(userID);
    if (!member) return '[error: $memberBoostingSince — member not found]';
    return member.premiumSince?.toISOString() ?? '';
  } catch (err) { return `[error: $memberBoostingSince — ${err.message}]`; }
};
