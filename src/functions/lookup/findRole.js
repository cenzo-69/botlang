'use strict';
// $findRole[guildID;query]  — finds a role by name or ID
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  const query   = String(args[1] !== undefined ? args[1] : '').trim();
  if (!guildID || !query) return '[error: GuildID and query are required!]';
  try {
    const guild = await context.client?.guilds.fetch(guildID);
    if (!guild) return '[error: Guild not found!]';
    const q    = query.toLowerCase();
    const role = guild.roles.cache.find(r => r.id === query || r.name.toLowerCase().includes(q));
    return role?.id ?? '';
  } catch (err) { return `[error: ${err.message}!]`; }
};
