'use strict';

// $publishMessage[channelID;messageID]
// Crossposts (publishes) a message in an announcement channel to all followers.
module.exports = async (context, args) => {
  const channelID = String(args[0] || '').trim();
  const messageID = String(args[1] || '').trim();
  if (!channelID || !messageID) return '[error: $publishMessage requires channelID and messageID]';
  try {
    const channel = await context.client.channels.fetch(channelID);
    const msg     = await channel.messages.fetch(messageID);
    await msg.crosspost();
    return '';
  } catch (err) {
    return `[error: $publishMessage — ${err.message}]`;
  }
};
