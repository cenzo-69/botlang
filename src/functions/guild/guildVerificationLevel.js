'use strict';
// $guildVerificationLevel[guildID?]  — returns guild verification level (None/Low/Medium/High/VeryHigh)
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  try {
    const guild = guildID ? await context.client?.guilds.fetch(guildID) : context.message?.guild;
    if (!guild) return '[error: Guild not found!]';
    const levels = { 0: 'None', 1: 'Low', 2: 'Medium', 3: 'High', 4: 'VeryHigh' };
    return levels[guild.verificationLevel] ?? String(guild.verificationLevel);
  } catch (err) { return `[error: ${err.message}!]`; }
};
