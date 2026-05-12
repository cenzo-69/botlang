'use strict';
// $roleColor[guildID;roleID]  — returns role color as hex string
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  const roleID  = String(args[1] !== undefined ? args[1] : '').trim();
  if (!guildID || !roleID) return '[error: $roleColor — guildID and roleID are required]';
  try {
    const guild = await context.client?.guilds.fetch(guildID);
    const role  = guild?.roles.cache.get(roleID);
    if (!role) return '[error: $roleColor — role not found]';
    return '#' + role.color.toString(16).padStart(6, '0').toUpperCase();
  } catch (err) { return `[error: $roleColor — ${err.message}]`; }
};
