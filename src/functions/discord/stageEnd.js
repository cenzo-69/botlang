'use strict';

// $stageEnd[channelID]
// Ends the active stage instance in a Stage channel.
module.exports = async (context, args) => {
  const channelID = String(args[0] !== undefined ? args[0] : '').trim();

  if (!channelID) return '[error: $stageEnd requires a channelID]';
  if (!context.message?.guild) return '[error: $stageEnd — not in a guild]';

  try {
    const channel = await context.client.channels.fetch(channelID);
    const stage   = await channel.fetchStageInstance();
    await stage.delete();
    return '';
  } catch (err) {
    return `[error: $stageEnd — ${err.message}]`;
  }
};
