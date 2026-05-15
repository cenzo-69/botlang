'use strict';

// $messageURL[messageID?]
// Returns the direct Discord link (jump URL) for a message.
// Defaults to the current message.
module.exports = async (context, args) => {
  const messageID = String(args[0] !== undefined ? args[0] : '').trim();
  if (!context.client) return '[error: No client!]';

  try {
    let msg;
    if (messageID) {
      const ch = context.message?.channel;
      if (!ch) return '[error: No channel context!]';
      msg = await ch.messages.fetch(messageID);
    } else {
      msg = context.message;
    }
    return msg?.url ?? '[error: Message not found!]';
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
