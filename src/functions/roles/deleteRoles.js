'use strict';

const { argError } = require('../../core/fnError');
// $deleteRoles[guildID;roleID1;roleID2;...;reason?]  — deletes multiple roles, returns count
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  const roleIDs = args.slice(1).map(a => String(a).trim()).filter(Boolean);
  if (!guildID) return argError(context, 'guild ID', 'Snowflake', guildID);
  if (!roleIDs.length) return '[error: At least one roleID is required!]';
  try {
    const guild = await context.client?.guilds.fetch(guildID);
    if (!guild) return '[error: Guild not found!]';
    let count = 0;
    for (const id of roleIDs) {
      const role = guild.roles.cache.get(id);
      if (role) { await role.delete(); count++; }
    }
    return String(count);
  } catch (err) { return `[error: ${err.message}!]`; }
};
