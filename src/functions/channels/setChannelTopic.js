'use strict';

// $setChannelTopic[topic;channelID?;reason?]
// Sets the topic of a text channel. Pass empty string to clear it.
module.exports = async (context, args) => {
  const topic     = String(args[0] !== undefined ? args[0] : '');
  const channelID = String(args[1] !== undefined ? args[1] : '').trim();
  const reason    = String(args[2] !== undefined ? args[2] : '').trim() || 'No reason provided';

  if (!context.client) return '[error: $setChannelTopic — no client]';

  try {
    const channel = channelID
      ? await context.client.channels.fetch(channelID)
      : context.message?.channel;
    if (!channel) return '[error: $setChannelTopic — channel not found]';
    await channel.setTopic(topic || null, reason);
    return '';
  } catch (err) {
    return `[error: $setChannelTopic — ${err.message}]`;
  }
};
