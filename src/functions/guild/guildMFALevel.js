'use strict';
// $guildMFALevel[guildID?]  — returns guild MFA level (None or Elevated)
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  try {
    const guild = guildID ? await context.client?.guilds.fetch(guildID) : context.message?.guild;
    if (!guild) return '[error: $guildMFALevel — guild not found]';
    return guild.mfaLevel === 1 ? 'Elevated' : 'None';
  } catch (err) { return `[error: $guildMFALevel — ${err.message}]`; }
};
