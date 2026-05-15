'use strict';
// $roleCreatedAt[guildID;roleID]  — returns role creation ISO date
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  const roleID  = String(args[1] !== undefined ? args[1] : '').trim();
  if (!guildID || !roleID) return '[error: GuildID and roleID are required!]';
  try {
    const guild = await context.client?.guilds.fetch(guildID);
    const role  = guild?.roles.cache.get(roleID);
    if (!role) return '[error: Role not found!]';
    return role.createdAt.toISOString();
  } catch (err) { return `[error: ${err.message}!]`; }
};
