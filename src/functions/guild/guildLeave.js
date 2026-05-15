'use strict';
// $guildLeave[guildID?]  — makes the bot leave the specified guild
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  try {
    const guild = guildID ? await context.client?.guilds.fetch(guildID) : context.message?.guild;
    if (!guild) return '[error: Guild not found!]';
    await guild.leave();
    return '';
  } catch (err) { return `[error: ${err.message}!]`; }
};
