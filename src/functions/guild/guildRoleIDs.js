'use strict';
// $guildRoleIDs[guildID?;separator?]  — returns all role IDs in the guild
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  const sep     = String(args[1] !== undefined ? args[1] : ', ');
  try {
    const guild = guildID ? await context.client?.guilds.fetch(guildID) : context.message?.guild;
    if (!guild) return '[error: $guildRoleIDs — guild not found]';
    return [...guild.roles.cache.keys()].join(sep);
  } catch (err) { return `[error: $guildRoleIDs — ${err.message}]`; }
};
