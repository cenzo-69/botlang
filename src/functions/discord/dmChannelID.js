'use strict';

// $dmChannelID[userID]
// Opens (or returns) the DM channel ID for the specified user.
module.exports = async (context, args) => {
  const userID = String(args[0] || '').trim();
  if (!userID) return '[error: $dmChannelID requires a userID]';
  try {
    const user      = await context.client.users.fetch(userID);
    const dmChannel = await user.createDM();
    return dmChannel.id;
  } catch (err) {
    return `[error: $dmChannelID — ${err.message}]`;
  }
};
