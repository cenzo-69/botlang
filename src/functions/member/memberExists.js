'use strict';
// $memberExists[guildID;userID]  — returns "true" if user is a member of the guild
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  const userID  = String(args[1] !== undefined ? args[1] : '').trim();
  if (!guildID || !userID) return '[error: GuildID and userID are required!]';
  try {
    const guild  = await context.client?.guilds.fetch(guildID);
    const member = await guild?.members.fetch(userID).catch(() => null);
    return String(!!member);
  } catch { return 'false'; }
};
