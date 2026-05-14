'use strict';

const { argError } = require('../../core/fnError');

// $dmChannelID[userID]
// Opens (or returns) the DM channel ID for the specified user.
module.exports = async (context, args) => {
  const userID = String(args[0] || '').trim();
  if (!userID) return argError(context, 'user ID', 'Snowflake', userID);
  try {
    const user      = await context.client.users.fetch(userID);
    const dmChannel = await user.createDM();
    return dmChannel.id;
  } catch (err) {
    return `[error: $dmChannelID — ${err.message}]`;
  }
};
