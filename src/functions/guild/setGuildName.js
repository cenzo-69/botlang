'use strict';
// $setGuildName[name;guildID?;reason?]  — renames the guild
module.exports = async (context, args) => {
  const name    = String(args[0] !== undefined ? args[0] : '').trim();
  const guildID = String(args[1] !== undefined ? args[1] : '').trim();
  const reason  = args[2] !== undefined ? String(args[2]) : undefined;
  if (!name) return '[error: $setGuildName — name is required]';
  try {
    const guild = guildID ? await context.client?.guilds.fetch(guildID) : context.message?.guild;
    if (!guild) return '[error: $setGuildName — guild not found]';
    await guild.setName(name, reason);
    return '';
  } catch (err) { return `[error: $setGuildName — ${err.message}]`; }
};
