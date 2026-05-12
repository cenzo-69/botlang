'use strict';
// $randomGuildEmojiID[guildID?]  — returns a random emoji ID from a guild
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  try {
    const guild = guildID ? await context.client?.guilds.fetch(guildID) : context.message?.guild;
    if (!guild) return '[error: $randomGuildEmojiID — guild not found]';
    const ids = [...guild.emojis.cache.keys()];
    if (!ids.length) return '';
    return ids[Math.floor(Math.random() * ids.length)];
  } catch (err) { return `[error: $randomGuildEmojiID — ${err.message}]`; }
};
