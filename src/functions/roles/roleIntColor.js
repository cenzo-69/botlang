'use strict';
// $roleIntColor[guildID;roleID]  — returns role color as an integer
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  const roleID  = String(args[1] !== undefined ? args[1] : '').trim();
  if (!guildID || !roleID) return '[error: $roleIntColor — guildID and roleID are required]';
  try {
    const guild = await context.client?.guilds.fetch(guildID);
    const role  = guild?.roles.cache.get(roleID);
    if (!role) return '[error: $roleIntColor — role not found]';
    return String(role.color);
  } catch (err) { return `[error: $roleIntColor — ${err.message}]`; }
};
