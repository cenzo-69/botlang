'use strict';

// $roleNames[(separator;guildID)]
// Returns all role names in the guild joined by separator (default ", ").
module.exports = async (context, args) => {
  const sep     = String(args[0] !== undefined ? args[0] : ', ');
  const guildID = String(args[1] || '').trim();
  let guild = context.message?.guild;
  if (guildID) {
    try { guild = await context.client.guilds.fetch(guildID); } catch { return '[error: guild not found]'; }
  }
  if (!guild) return '[error: no guild]';
  return [...guild.roles.cache.values()].map(r => r.name).join(sep);
};
