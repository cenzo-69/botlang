'use strict';

// $userReacted[emoji;userID?;messageID?;channelID?]
// Returns "true" if the specified user reacted with the given emoji on a message.
// If userID is omitted, checks the triggering message author.
// If messageID is omitted, checks the triggering message.
module.exports = async (context, args) => {
  const emoji     = args[0];
  const userID    = args[1] || context.message?.author?.id;
  const messageID = args[2];
  const channelID = args[3];

  if (!emoji || !userID) return 'false';
  if (!context.client) return '[userReacted error: no client]';

  try {
    let msg = context.message;

    if (messageID) {
      const ch = channelID
        ? await context.client.channels.fetch(channelID)
        : context.message?.channel;
      if (!ch) return 'false';
      msg = await ch.messages.fetch(messageID);
    }

    if (!msg) return 'false';

    const reaction = msg.reactions.cache.find(r =>
      r.emoji.name === emoji || r.emoji.toString() === emoji || r.emoji.id === emoji
    );

    if (!reaction) return 'false';

    const users = await reaction.users.fetch();
    return users.has(userID) ? 'true' : 'false';
  } catch (err) {
    return `[userReacted error: ${err.message}]`;
  }
};
