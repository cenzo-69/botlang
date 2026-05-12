'use strict';
// $memberAddRoles[guildID;userID;roleID1;roleID2;...;reason?]  — adds roles to member
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  const userID  = String(args[1] !== undefined ? args[1] : '').trim();
  const roleIDs = args.slice(2).map(a => String(a).trim()).filter(Boolean);
  if (!guildID || !userID) return '[error: $memberAddRoles — guildID and userID are required]';
  if (!roleIDs.length) return '[error: $memberAddRoles — at least one roleID is required]';
  try {
    const guild  = await context.client?.guilds.fetch(guildID);
    const member = await guild?.members.fetch(userID);
    if (!member) return '[error: $memberAddRoles — member not found]';
    await member.roles.add(roleIDs);
    return '';
  } catch (err) { return `[error: $memberAddRoles — ${err.message}]`; }
};
