'use strict';
// $guildDescription[guildID?]  — returns guild description, or empty string
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  try {
    const guild = guildID ? await context.client?.guilds.fetch(guildID) : context.message?.guild;
    if (!guild) return '[error: $guildDescription — guild not found]';
    return guild.description ?? '';
  } catch (err) { return `[error: $guildDescription — ${err.message}]`; }
};
