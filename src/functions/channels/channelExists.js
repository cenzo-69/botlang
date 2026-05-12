'use strict';

// $channelExists[channelID]
// Returns "true" if the channel ID exists and the bot can access it.
module.exports = async (context, args) => {
  const channelID = String(args[0] !== undefined ? args[0] : '').trim();
  if (!channelID || !context.client) return 'false';
  try {
    await context.client.channels.fetch(channelID);
    return 'true';
  } catch {
    return 'false';
  }
};
