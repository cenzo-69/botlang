'use strict';
// $guildVanityCode[guildID?]  — returns the guild's vanity URL code, or empty string
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  try {
    const guild = guildID ? await context.client?.guilds.fetch(guildID) : context.message?.guild;
    if (!guild) return '[error: $guildVanityCode — guild not found]';
    return guild.vanityURLCode ?? '';
  } catch (err) { return `[error: $guildVanityCode — ${err.message}]`; }
};
