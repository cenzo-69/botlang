'use strict';
// $guildFeatures[guildID?;separator?]  — returns guild features list
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  const sep     = String(args[1] !== undefined ? args[1] : ', ');
  try {
    const guild = guildID ? await context.client?.guilds.fetch(guildID) : context.message?.guild;
    if (!guild) return '[error: Guild not found!]';
    return (guild.features ?? []).join(sep);
  } catch (err) { return `[error: ${err.message}!]`; }
};
