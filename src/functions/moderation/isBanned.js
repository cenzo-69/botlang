'use strict';

const { argError } = require('../../core/fnError');

// $isBanned[userID]
// Returns "true" if the user is currently banned from the guild.
module.exports = async (context, args) => {
  const userID = String(args[0] !== undefined ? args[0] : '').trim();
  if (!userID) return argError(context, 'user ID', 'Snowflake', userID);
  if (!context.message?.guild) return '[error: $isBanned — not in a guild]';

  try {
    await context.message.guild.bans.fetch(userID);
    return 'true';
  } catch {
    return 'false';
  }
};
