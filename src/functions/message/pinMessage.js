'use strict';

// $pinMessage[messageID?;channelID?;reason?]
// Pins a message. Defaults to the current message if messageID is omitted.
module.exports = async (context, args) => {
  const messageID = String(args[0] !== undefined ? args[0] : '').trim();
  const channelID = String(args[1] !== undefined ? args[1] : '').trim();
  const reason    = String(args[2] !== undefined ? args[2] : '').trim() || 'Pinned via bot';

  if (!context.client) return '[error: $pinMessage — no client]';

  try {
    let msg;
    if (messageID) {
      const ch = channelID
        ? await context.client.channels.fetch(channelID)
        : context.message?.channel;
      if (!ch) return '[error: $pinMessage — channel not found]';
      msg = await ch.messages.fetch(messageID);
    } else {
      msg = context.message;
    }
    if (!msg) return '[error: $pinMessage — message not found]';
    await msg.pin(reason);
    return '';
  } catch (err) {
    return `[error: $pinMessage — ${err.message}]`;
  }
};
