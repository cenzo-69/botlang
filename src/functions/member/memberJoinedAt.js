'use strict';

const { argError } = require('../../core/fnError');
// $memberJoinedAt[guildID;userID?]  — returns ISO join date of the member
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  const userID  = String(args[1] !== undefined ? args[1] : '').trim() || context.message?.author?.id;
  if (!guildID) return argError(context, 'guild ID', 'Snowflake', guildID);
  if (!userID)  return argError(context, 'user ID', 'Snowflake', userID);
  try {
    const guild  = await context.client?.guilds.fetch(guildID);
    const member = await guild?.members.fetch(userID);
    if (!member) return '[error: $memberJoinedAt — member not found]';
    return member.joinedAt?.toISOString() ?? '';
  } catch (err) { return `[error: $memberJoinedAt — ${err.message}]`; }
};
