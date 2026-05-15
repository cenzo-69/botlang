'use strict';
// $messageType[channelID?;messageID?]  — returns the message type string
module.exports = async (context, args) => {
  const channelID = String(args[0] !== undefined ? args[0] : '').trim();
  const messageID = String(args[1] !== undefined ? args[1] : '').trim();
  try {
    if (channelID && messageID) {
      const ch  = await context.client?.channels.fetch(channelID);
      const msg = await ch?.messages.fetch(messageID);
      return String(msg?.type ?? '');
    }
    return String(context.message?.type ?? '');
  } catch (err) { return `[error: ${err.message}!]`; }
};
