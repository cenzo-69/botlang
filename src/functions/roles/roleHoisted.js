'use strict';
// $roleHoisted[guildID;roleID]  — returns "true" if role is displayed separately in the member list
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  const roleID  = String(args[1] !== undefined ? args[1] : '').trim();
  if (!guildID || !roleID) return '[error: $roleHoisted — guildID and roleID are required]';
  try {
    const guild = await context.client?.guilds.fetch(guildID);
    const role  = guild?.roles.cache.get(roleID);
    if (!role) return '[error: $roleHoisted — role not found]';
    return String(role.hoist);
  } catch (err) { return `[error: $roleHoisted — ${err.message}]`; }
};
