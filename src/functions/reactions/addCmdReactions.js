'use strict';

// $addCmdReactions[emoji1;emoji2;...]
// Add reactions to the triggering command message (convenience alias for $addReactions on the command message).
module.exports = async (context, args) => {
  if (!args.length) return '[addCmdReactions error: no emojis]';

  const msg = context.message;
  if (!msg) return '[addCmdReactions error: no message]';

  for (const emoji of args) {
    try {
      await msg.react(emoji);
    } catch (err) {
      console.warn(`[$addCmdReactions] Failed to react with ${emoji}: ${err.message}`);
    }
  }

  return '';
};
