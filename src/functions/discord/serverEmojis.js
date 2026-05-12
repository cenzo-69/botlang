'use strict';

// $serverEmojis[guildID;separator]
// Returns all custom emoji strings in the guild joined by separator.
module.exports = async (context, args) => {
  const guildID = String(args[0] || '').trim();
  const sep     = String(args[1] !== undefined ? args[1] : ', ');
  let guild = context.message?.guild;
  if (guildID) {
    try { guild = await context.client.guilds.fetch(guildID); } catch { return '[error: guild not found]'; }
  }
  if (!guild) return '[error: no guild]';
  const emojis = [...guild.emojis.cache.values()];
  return emojis.map(e => `<${e.animated ? 'a' : ''}:${e.name}:${e.id}>`).join(sep) || '';
};
