'use strict';
// $guildChannelCount[guildID?]  — returns total channel count in the guild
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  try {
    const guild = guildID ? await context.client?.guilds.fetch(guildID) : context.message?.guild;
    if (!guild) return '[error: $guildChannelCount — guild not found]';
    return String(guild.channels.cache.size);
  } catch (err) { return `[error: $guildChannelCount — ${err.message}]`; }
};
