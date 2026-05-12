'use strict';
// $guildBotCount[guildID?]  — returns count of bot members in the guild
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  try {
    const guild = guildID ? await context.client?.guilds.fetch(guildID) : context.message?.guild;
    if (!guild) return '[error: $guildBotCount — guild not found]';
    await guild.members.fetch();
    return String(guild.members.cache.filter(m => m.user.bot).size);
  } catch (err) { return `[error: $guildBotCount — ${err.message}]`; }
};
