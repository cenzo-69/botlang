'use strict';
// $guildRoleCount[guildID?]  — returns number of roles in the guild
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  try {
    const guild = guildID ? await context.client?.guilds.fetch(guildID) : context.message?.guild;
    if (!guild) return '[error: Guild not found!]';
    return String(guild.roles.cache.size);
  } catch (err) { return `[error: ${err.message}!]`; }
};
