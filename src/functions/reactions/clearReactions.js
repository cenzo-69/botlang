'use strict';

// $clearReactions[messageID?;channelID?]
// Remove ALL reactions from a message. Requires Manage Messages permission.
// If messageID is omitted, clears reactions on the triggering message.
module.exports = async (context, args) => {
  const messageID = args[0];
  const channelID = args[1];

  if (!context.client) return '[clearReactions error: no client]';

  try {
    let msg = context.message;

    if (messageID) {
      const ch = channelID
        ? await context.client.channels.fetch(channelID)
        : context.message?.channel;
      if (!ch) return '[clearReactions error: channel not found]';
      msg = await ch.messages.fetch(messageID);
    }

    if (!msg) return '[clearReactions error: no message]';
    await msg.reactions.removeAll();
    return '';
  } catch (err) {
    return `[clearReactions error: ${err.message}]`;
  }
};
