'use strict';

const fnError = require('../../core/fnError');

// $sendMessage[content;channelID?]
// Sends a message to the current channel or a specified channel.
module.exports = async (context, args) => {
  const content   = String(args[0] !== undefined ? args[0] : '').trim();
  const channelId = args[1] !== undefined ? String(args[1]).trim() : '';

  if (!content) {
    return fnError('sendMessage', 'message content is required', {
      expected: 'a non-empty string',
      example:  '$sendMessage[Hello, world!]',
    });
  }

  const client = context.client;
  if (!client) return fnError('sendMessage', 'no client available in this context');

  try {
    const channel = channelId
      ? await client.channels.fetch(channelId)
      : (context.message?.channel ?? context.interaction?.channel);

    if (!channel) {
      return fnError('sendMessage', 'could not resolve target channel', {
        got:     channelId || '(current channel)',
        tip:     'Make sure the bot has access to that channel',
        example: '$sendMessage[Hello!;123456789]',
      });
    }

    const sent = await channel.send(content);
    return sent.id;
  } catch (err) {
    return fnError('sendMessage', err.message, {
      tip: 'Check bot permissions and channel access',
    });
  }
};
