'use strict';

// $removeButtons[messageID?]
// Removes all button components from a message.
// Defaults to the current message if no messageID is provided.
module.exports = async (context, args) => {
  const messageID = String(args[0] !== undefined ? args[0] : '').trim();
  if (!context.client) return '[error: $removeButtons — no client]';

  try {
    const msg = messageID
      ? await context.message.channel.messages.fetch(messageID)
      : context.message;
    if (!msg) return '[error: $removeButtons — message not found]';
    await msg.edit({ components: [] });
    return '';
  } catch (err) {
    return `[error: $removeButtons — ${err.message}]`;
  }
};
