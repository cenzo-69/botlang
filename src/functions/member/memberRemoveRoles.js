'use strict';
// $memberRemoveRoles[guildID;userID;roleID1;roleID2;...]  — removes roles from member
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  const userID  = String(args[1] !== undefined ? args[1] : '').trim();
  const roleIDs = args.slice(2).map(a => String(a).trim()).filter(Boolean);
  if (!guildID || !userID) return '[error: $memberRemoveRoles — guildID and userID are required]';
  if (!roleIDs.length) return '[error: $memberRemoveRoles — at least one roleID is required]';
  try {
    const guild  = await context.client?.guilds.fetch(guildID);
    const member = await guild?.members.fetch(userID);
    if (!member) return '[error: $memberRemoveRoles — member not found]';
    await member.roles.remove(roleIDs);
    return '';
  } catch (err) { return `[error: $memberRemoveRoles — ${err.message}]`; }
};
