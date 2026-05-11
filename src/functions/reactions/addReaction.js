'use strict';

// $addReaction[emoji;messageID?;channelID?]
// React to a message with an emoji.
// If messageID is omitted, reacts to the triggering message.
// emoji can be a Unicode emoji or a custom emoji ID/string like <:name:id>
module.exports = async (context, args) => {
  const emoji     = args[0];
  const messageID = args[1];
  const channelID = args[2];

  if (!emoji) return '[addReaction error: no emoji provided]';
  if (!context.client) return '[addReaction error: no client]';

  try {
    let msg = context.message;

    if (messageID) {
      const ch = channelID
        ? await context.client.channels.fetch(channelID)
        : context.message?.channel;
      if (!ch) return '[addReaction error: channel not found]';
      msg = await ch.messages.fetch(messageID);
    }

    if (!msg) return '[addReaction error: no message]';
    await msg.react(emoji);
    return '';
  } catch (err) {
    return `[addReaction error: ${err.message}]`;
  }
};
