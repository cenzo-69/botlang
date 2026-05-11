'use strict';

// $getReactions[emoji;messageID?;channelID?]
// Returns the count of a specific reaction on a message.
// If messageID is omitted, checks the triggering message.
module.exports = async (context, args) => {
  const emoji     = args[0];
  const messageID = args[1];
  const channelID = args[2];

  if (!emoji) return '[getReactions error: no emoji]';
  if (!context.client) return '[getReactions error: no client]';

  try {
    let msg = context.message;

    if (messageID) {
      const ch = channelID
        ? await context.client.channels.fetch(channelID)
        : context.message?.channel;
      if (!ch) return '[getReactions error: channel not found]';
      msg = await ch.messages.fetch(messageID);
    }

    if (!msg) return '[getReactions error: no message]';

    const reaction = msg.reactions.cache.find(r =>
      r.emoji.name === emoji || r.emoji.toString() === emoji || r.emoji.id === emoji
    );

    return reaction ? String(reaction.count) : '0';
  } catch (err) {
    return `[getReactions error: ${err.message}]`;
  }
};
