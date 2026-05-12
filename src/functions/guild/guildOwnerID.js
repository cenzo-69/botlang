'use strict';
// $guildOwnerID[guildID?]  — returns guild owner's user ID
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  try {
    const guild = guildID ? await context.client?.guilds.fetch(guildID) : context.message?.guild;
    if (!guild) return '[error: $guildOwnerID — guild not found]';
    return guild.ownerId;
  } catch (err) { return `[error: $guildOwnerID — ${err.message}]`; }
};
