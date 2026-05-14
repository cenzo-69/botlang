'use strict';

const { argError } = require('../../core/fnError');
// $memberRoles[guildID;userID?;separator?]  — returns role IDs the member has
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  const userID  = String(args[1] !== undefined ? args[1] : '').trim() || context.message?.author?.id;
  const sep     = String(args[2] !== undefined ? args[2] : ', ');
  if (!guildID) return argError(context, 'guild ID', 'Snowflake', guildID);
  if (!userID)  return argError(context, 'user ID', 'Snowflake', userID);
  try {
    const guild  = await context.client?.guilds.fetch(guildID);
    const member = await guild?.members.fetch(userID);
    if (!member) return '[error: $memberRoles — member not found]';
    return [...member.roles.cache.keys()].join(sep);
  } catch (err) { return `[error: $memberRoles — ${err.message}]`; }
};
