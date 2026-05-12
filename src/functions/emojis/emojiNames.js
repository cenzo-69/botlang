'use strict';
// $emojiNames[guildID;separator?]  — returns all emoji names of a guild
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  const sep     = String(args[1] !== undefined ? args[1] : ', ');
  try {
    const guild = guildID ? await context.client?.guilds.fetch(guildID) : context.message?.guild;
    if (!guild) return '[error: $emojiNames — guild not found]';
    return [...guild.emojis.cache.values()].map(e => e.name).join(sep);
  } catch (err) { return `[error: $emojiNames — ${err.message}]`; }
};
