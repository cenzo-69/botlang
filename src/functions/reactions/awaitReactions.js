'use strict';

// $awaitReactions[emojis;timeout?;userID?]
// Waits for a reaction on the triggering message.
// emojis:  comma-separated list of accepted emoji (e.g. "👍,👎") — empty = any
// timeout: ms to wait (default 30000)
// userID:  restrict to a specific user (default: message author)
// Returns the emoji that was reacted, or empty string on timeout.
module.exports = async (context, args) => {
  const emojiList = String(args[0] ?? '').split(',').map(e => e.trim()).filter(Boolean);
  const timeout   = parseInt(args[1] ?? '30000');
  const userID    = String(args[2] ?? context.message?.author?.id ?? '').trim();

  const message = context.message;
  if (!message) return '[awaitReactions error: no message]';

  const ms = isNaN(timeout) ? 30000 : Math.min(timeout, 300000);

  try {
    const collected = await message.awaitReactions({
      filter: (reaction, user) => {
        const emojiOk = !emojiList.length || emojiList.includes(reaction.emoji.name);
        const userOk  = !userID || user.id === userID;
        return emojiOk && userOk && !user.bot;
      },
      max: 1,
      time: ms,
      errors: ['time'],
    });
    return collected.first()?.emoji?.name ?? '';
  } catch {
    return '';
  }
};
