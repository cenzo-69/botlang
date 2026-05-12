'use strict';

// $channelNames[separator;(guildID)]
// Returns a list of all channel names in the guild joined by the separator.
module.exports = async (context, args) => {
  const sep    = String(args[0] !== undefined ? args[0] : ', ');
  const guildID = String(args[1] || '').trim();
  let guild = context.message?.guild;
  if (guildID) {
    try { guild = await context.client.guilds.fetch(guildID); } catch { return '[error: guild not found]'; }
  }
  if (!guild) return '[error: no guild]';
  return [...guild.channels.cache.values()].map(c => c.name).join(sep);
};
