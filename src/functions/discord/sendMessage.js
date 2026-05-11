'use strict';

// $sendMessage[content]
// $sendMessage[content;channelID]
module.exports = async (context, args) => {
  if (!context.message) return '';

  const content = args[0] || '';
  const channelId = args[1];

  try {
    const channel = channelId
      ? await context.client.channels.fetch(channelId)
      : context.message.channel;

    await channel.send(content);
  } catch (err) {
    console.error(`[$sendMessage] ${err.message}`);
  }

  return '';
};
