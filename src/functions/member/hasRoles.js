'use strict';
// $hasRoles[guildID;userID;roleID1;roleID2;...]  — "true" if member has ALL listed roles
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  const userID  = String(args[1] !== undefined ? args[1] : '').trim();
  const roleIDs = args.slice(2).map(a => String(a).trim()).filter(Boolean);
  if (!guildID || !userID) return '[error: $hasRoles — guildID and userID are required]';
  if (!roleIDs.length) return '[error: $hasRoles — at least one roleID is required]';
  try {
    const guild  = await context.client?.guilds.fetch(guildID);
    const member = await guild?.members.fetch(userID);
    if (!member) return 'false';
    return String(roleIDs.every(rid => member.roles.cache.has(rid)));
  } catch { return 'false'; }
};
