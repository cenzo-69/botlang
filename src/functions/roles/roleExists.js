'use strict';
// $roleExists[guildID;roleID]  — returns "true" if role exists in guild
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  const roleID  = String(args[1] !== undefined ? args[1] : '').trim();
  if (!guildID || !roleID) return '[error: $roleExists — guildID and roleID are required]';
  try {
    const guild = await context.client?.guilds.fetch(guildID);
    return String(guild?.roles.cache.has(roleID) ?? false);
  } catch { return 'false'; }
};
