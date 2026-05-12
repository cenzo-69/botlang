'use strict';
// $memberSetNickname[guildID;userID;nickname;reason?]  — sets member nickname
module.exports = async (context, args) => {
  const guildID  = String(args[0] !== undefined ? args[0] : '').trim();
  const userID   = String(args[1] !== undefined ? args[1] : '').trim();
  const nickname = args[2] !== undefined ? String(args[2]).trim() : null;
  const reason   = args[3] !== undefined ? String(args[3]) : undefined;
  if (!guildID || !userID) return '[error: $memberSetNickname — guildID and userID are required]';
  try {
    const guild  = await context.client?.guilds.fetch(guildID);
    const member = await guild?.members.fetch(userID);
    if (!member) return '[error: $memberSetNickname — member not found]';
    await member.setNickname(nickname || null, reason);
    return '';
  } catch (err) { return `[error: $memberSetNickname — ${err.message}]`; }
};
