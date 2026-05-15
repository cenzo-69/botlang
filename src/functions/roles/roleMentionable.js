'use strict';
// $roleMentionable[guildID;roleID]  — returns "true" if role can be mentioned by anyone
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  const roleID  = String(args[1] !== undefined ? args[1] : '').trim();
  if (!guildID || !roleID) return '[error: GuildID and roleID are required!]';
  try {
    const guild = await context.client?.guilds.fetch(guildID);
    const role  = guild?.roles.cache.get(roleID);
    if (!role) return '[error: Role not found!]';
    return String(role.mentionable);
  } catch (err) { return `[error: ${err.message}!]`; }
};
