'use strict';
// $guildOwnerID[guildID?]  — returns guild owner's user ID
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  try {
    const guild = guildID ? await context.client?.guilds.fetch(guildID) : context.message?.guild;
    if (!guild) return '[error: Guild not found!]';
    return guild.ownerId;
  } catch (err) { return `[error: ${err.message}!]`; }
};
