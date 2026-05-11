'use strict';

// $crosspost[messageID?;channelID?]
// Publishes (crossposts) a message in an Announcement channel to all followers.
// Only works in News/Announcement channels.
module.exports = async (context, args) => {
  const messageID = String(args[0] !== undefined ? args[0] : '').trim();
  const channelID = String(args[1] !== undefined ? args[1] : '').trim();

  if (!context.client) return '[error: $crosspost — no client]';

  try {
    let msg;
    if (messageID) {
      const ch = channelID
        ? await context.client.channels.fetch(channelID)
        : context.message?.channel;
      msg = await ch?.messages.fetch(messageID);
    } else {
      msg = context.message;
    }
    if (!msg) return '[error: $crosspost — message not found]';
    await msg.crosspost();
    return '';
  } catch (err) {
    return `[error: $crosspost — ${err.message}]`;
  }
};
