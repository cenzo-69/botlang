'use strict';
// $guildChannelIDs[guildID?;separator?]  — returns all channel IDs in the guild
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  const sep     = String(args[1] !== undefined ? args[1] : ', ');
  try {
    const guild = guildID ? await context.client?.guilds.fetch(guildID) : context.message?.guild;
    if (!guild) return '[error: Guild not found!]';
    return [...guild.channels.cache.keys()].join(sep);
  } catch (err) { return `[error: ${err.message}!]`; }
};
