'use strict';

const { argError } = require('../../core/fnError');
// $memberPerms[guildID;userID?;separator?]  — returns permission names the member has
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  const userID  = String(args[1] !== undefined ? args[1] : '').trim() || context.message?.author?.id;
  const sep     = String(args[2] !== undefined ? args[2] : ', ');
  if (!guildID) return argError(context, 'guild ID', 'Snowflake', guildID);
  try {
    const guild  = await context.client?.guilds.fetch(guildID);
    const member = await guild?.members.fetch(userID);
    if (!member) return '[error: $memberPerms — member not found]';
    return [...member.permissions.toArray()].join(sep);
  } catch (err) { return `[error: $memberPerms — ${err.message}]`; }
};
