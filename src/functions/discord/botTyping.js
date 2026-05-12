'use strict';

const fnError = require('../../core/fnError');

// $botTyping[channelID?]  — shows "Bot is typing..." indicator
module.exports = async (context, args) => {
  const channelID = String(args[0] !== undefined ? args[0] : '').trim();
  const client    = context.client;

  if (!client) return fnError('botTyping', 'no Discord client available in this context');

  try {
    const channel = channelID
      ? await client.channels.fetch(channelID)
      : (context.message?.channel ?? context.interaction?.channel);

    if (!channel) {
      return fnError('botTyping', 'could not resolve channel', {
        got:     channelID || '(current channel)',
        tip:     'Make sure the channel ID is valid and the bot has access',
        example: '$botTyping[123456789]',
      });
    }

    await channel.sendTyping();
  } catch (err) {
    return fnError('botTyping', err.message);
  }

  return '';
};
