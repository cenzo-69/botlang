'use strict';

const { argError } = require('../../core/fnError');

// $stageEnd[channelID]
// Ends the active stage instance in a Stage channel.
module.exports = async (context, args) => {
  const channelID = String(args[0] !== undefined ? args[0] : '').trim();

  if (!channelID) return argError(context, 'channel ID', 'TextChannel', channelID);
  if (!context.message?.guild) return '[error: Not in a guild!]';

  try {
    const channel = await context.client.channels.fetch(channelID);
    const stage   = await channel.fetchStageInstance();
    await stage.delete();
    return '';
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
