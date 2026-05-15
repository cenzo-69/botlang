'use strict';
// $emojiIDs[separator?]  — returns all custom emoji IDs across all guilds
module.exports = async (context, args) => {
  const sep = String(args[0] !== undefined ? args[0] : ', ');
  if (!context.client) return '[error: No client available!]';
  return [...context.client.emojis.cache.keys()].join(sep);
};
