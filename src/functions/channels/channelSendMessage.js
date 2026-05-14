'use strict';

const { argError } = require('../../core/fnError');

// $channelSendMessage[channelID;content]
// Send a message to any channel by ID.
module.exports = async (context, args) => {
  if (!context.client) return '[error: no client]';

  const channelID = args[0];
  const content   = args[1] || '';

  if (!channelID) return argError(context, 'channel ID', 'TextChannel', channelID);

  try {
    const channel = await context.client.channels.fetch(channelID);
    if (!channel) return '[error: channel not found]';
    await channel.send(content);
    return '';
  } catch (err) {
    console.error(`[$channelSendMessage] ${err.message}`);
    return `[error: ${err.message}]`;
  }
};
