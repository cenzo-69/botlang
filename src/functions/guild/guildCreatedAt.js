'use strict';
// $guildCreatedAt[guildID?]  — returns guild creation date as ISO string
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  try {
    const guild = guildID ? await context.client?.guilds.fetch(guildID) : context.message?.guild;
    if (!guild) return '[error: $guildCreatedAt — guild not found]';
    return guild.createdAt.toISOString();
  } catch (err) { return `[error: $guildCreatedAt — ${err.message}]`; }
};
