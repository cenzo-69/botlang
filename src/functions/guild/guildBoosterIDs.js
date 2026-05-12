'use strict';
// $guildBoosterIDs[guildID?;separator?]  — returns IDs of members currently boosting
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  const sep     = String(args[1] !== undefined ? args[1] : ', ');
  try {
    const guild = guildID ? await context.client?.guilds.fetch(guildID) : context.message?.guild;
    if (!guild) return '[error: $guildBoosterIDs — guild not found]';
    await guild.members.fetch();
    const boosters = guild.members.cache.filter(m => m.premiumSince).map(m => m.id);
    return boosters.join(sep);
  } catch (err) { return `[error: $guildBoosterIDs — ${err.message}]`; }
};
