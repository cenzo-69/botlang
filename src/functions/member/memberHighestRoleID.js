'use strict';
// $memberHighestRoleID[guildID;userID?]  — returns the highest role ID of a member
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  const userID  = String(args[1] !== undefined ? args[1] : '').trim() || context.message?.author?.id;
  if (!guildID) return '[error: $memberHighestRoleID — guildID is required]';
  try {
    const guild  = await context.client?.guilds.fetch(guildID);
    const member = await guild?.members.fetch(userID);
    if (!member) return '[error: $memberHighestRoleID — member not found]';
    return member.roles.highest.id;
  } catch (err) { return `[error: $memberHighestRoleID — ${err.message}]`; }
};
