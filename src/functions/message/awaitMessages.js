'use strict';

// $awaitMessages[timeout?;userID?]
// Waits for the next message in the channel from the triggering user (or any user).
// timeout: milliseconds to wait (default 30000 = 30s)
// userID:  restrict to a specific user (default: message author)
// Returns the collected message content, or empty string on timeout.
module.exports = async (context, args) => {
  const timeout = parseInt(args[0] ?? '30000');
  const userID  = String(args[1] ?? context.message?.author?.id ?? '').trim();

  const channel = context.message?.channel;
  if (!channel) return '[awaitMessages error: no channel]';

  const ms = isNaN(timeout) ? 30000 : Math.min(timeout, 300000);

  try {
    const collected = await channel.awaitMessages({
      filter: m => !userID || m.author.id === userID,
      max: 1,
      time: ms,
      errors: ['time'],
    });
    return collected.first()?.content ?? '';
  } catch {
    return '';
  }
};
