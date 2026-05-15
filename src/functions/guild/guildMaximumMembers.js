'use strict';
// $guildMaximumMembers[guildID?]  — returns the guild's maximum member capacity
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  try {
    const guild = guildID ? await context.client?.guilds.fetch(guildID) : context.message?.guild;
    if (!guild) return '[error: Guild not found!]';
    return String(guild.maximumMembers ?? 0);
  } catch (err) { return `[error: ${err.message}!]`; }
};
