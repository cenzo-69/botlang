'use strict';

// $serverIcon[guildID?]  — returns the server's icon URL (empty string if none)
// guildID is optional; defaults to the current guild.
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();

  try {
    const guild = guildID
      ? await context.client?.guilds.fetch(guildID)
      : context.message?.guild;

    if (!guild) return '';
    return guild.iconURL({ size: 1024 }) || '';
  } catch {
    return '';
  }
};
