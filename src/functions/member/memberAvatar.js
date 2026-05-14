'use strict';

const { argError } = require('../../core/fnError');
// $memberAvatar[guildID;userID?]  — guild member avatar URL (falls back to user avatar)
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  const userID  = String(args[1] !== undefined ? args[1] : '').trim() || context.message?.author?.id;
  if (!guildID) return argError(context, 'guild ID', 'Snowflake', guildID);
  if (!userID)  return argError(context, 'user ID', 'Snowflake', userID);
  try {
    const guild  = await context.client?.guilds.fetch(guildID);
    if (!guild) return '[error: $memberAvatar — guild not found]';
    const member = await guild.members.fetch(userID);
    if (!member) return '[error: $memberAvatar — member not found]';
    return member.displayAvatarURL({ size: 1024 }) ?? '';
  } catch (err) { return `[error: $memberAvatar — ${err.message}]`; }
};
