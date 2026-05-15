'use strict';
// $guildBoostLevel[guildID?]  — returns the guild's Nitro boost tier (0–3)
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  try {
    const guild = guildID ? await context.client?.guilds.fetch(guildID) : context.message?.guild;
    if (!guild) return '[error: Guild not found!]';
    return String(guild.premiumTier ?? 0);
  } catch (err) { return `[error: ${err.message}!]`; }
};
