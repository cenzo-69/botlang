'use strict';

// $addReactions[emoji1;emoji2;...;messageID?]
// Add multiple reactions to the triggering message (or a specified messageID as last arg).
// Pass messageID as last argument if needed — detected by checking if last arg looks like a snowflake.
module.exports = async (context, args) => {
  if (!args.length) return '[addReactions error: no emojis]';
  if (!context.client) return '[addReactions error: no client]';

  let emojis = [...args];
  let msg    = context.message;

  // If last arg looks like a Discord snowflake ID, treat it as messageID
  const last = emojis[emojis.length - 1] || '';
  if (/^\d{17,20}$/.test(last)) {
    emojis = emojis.slice(0, -1);
    try {
      msg = await context.message?.channel?.messages.fetch(last);
    } catch (err) {
      return `[addReactions error: ${err.message}]`;
    }
  }

  if (!msg) return '[addReactions error: no message]';

  for (const emoji of emojis) {
    try {
      await msg.react(emoji);
    } catch (err) {
      console.warn(`[$addReactions] Failed to react with ${emoji}: ${err.message}`);
    }
  }

  return '';
};
