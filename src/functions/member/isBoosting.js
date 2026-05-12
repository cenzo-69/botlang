'use strict';
// $isBoosting[guildID;userID?]  — returns "true" if member is currently boosting
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  const userID  = String(args[1] !== undefined ? args[1] : '').trim() || context.message?.author?.id;
  if (!guildID) return '[error: $isBoosting — guildID is required]';
  try {
    const guild  = await context.client?.guilds.fetch(guildID);
    const member = await guild?.members.fetch(userID).catch(() => null);
    return String(!!member?.premiumSince);
  } catch { return 'false'; }
};
