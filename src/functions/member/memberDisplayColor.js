'use strict';
// $memberDisplayColor[guildID;userID?]  — hex display color of the member's highest colored role
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  const userID  = String(args[1] !== undefined ? args[1] : '').trim() || context.message?.author?.id;
  if (!guildID) return '[error: $memberDisplayColor — guildID is required]';
  try {
    const guild  = await context.client?.guilds.fetch(guildID);
    const member = await guild?.members.fetch(userID);
    if (!member) return '[error: $memberDisplayColor — member not found]';
    return '#' + member.displayColor.toString(16).padStart(6, '0').toUpperCase();
  } catch (err) { return `[error: $memberDisplayColor — ${err.message}]`; }
};
