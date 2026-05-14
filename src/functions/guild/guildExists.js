'use strict';

const { argError } = require('../../core/fnError');
// $guildExists[guildID]  — returns "true" if bot can access the guild
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  if (!guildID) return argError(context, 'guild ID', 'Snowflake', guildID);
  try {
    const guild = await context.client?.guilds.fetch(guildID);
    return String(!!guild);
  } catch { return 'false'; }
};
