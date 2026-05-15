'use strict';
// $guildPreferredLocale[guildID?]  — returns the guild's preferred locale (e.g. en-US)
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  try {
    const guild = guildID ? await context.client?.guilds.fetch(guildID) : context.message?.guild;
    if (!guild) return '[error: Guild not found!]';
    return guild.preferredLocale ?? 'en-US';
  } catch (err) { return `[error: ${err.message}!]`; }
};
