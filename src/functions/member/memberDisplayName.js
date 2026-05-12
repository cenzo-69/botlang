'use strict';
// $memberDisplayName[guildID;userID?]  — returns member's display name (nickname or username)
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  const userID  = String(args[1] !== undefined ? args[1] : '').trim() || context.message?.author?.id;
  if (!guildID) return '[error: $memberDisplayName — guildID is required]';
  if (!userID)  return '[error: $memberDisplayName — userID is required]';
  try {
    const guild  = await context.client?.guilds.fetch(guildID);
    const member = await guild?.members.fetch(userID);
    if (!member) return '[error: $memberDisplayName — member not found]';
    return member.displayName;
  } catch (err) { return `[error: $memberDisplayName — ${err.message}]`; }
};
