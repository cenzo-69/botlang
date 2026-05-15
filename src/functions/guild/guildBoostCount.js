'use strict';
// $guildBoostCount[guildID?]  — returns number of server boosts
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  try {
    const guild = guildID ? await context.client?.guilds.fetch(guildID) : context.message?.guild;
    if (!guild) return '[error: Guild not found!]';
    return String(guild.premiumSubscriptionCount ?? 0);
  } catch (err) { return `[error: ${err.message}!]`; }
};
