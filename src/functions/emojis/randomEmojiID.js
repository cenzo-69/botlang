'use strict';
// $randomEmojiID  — returns a random emoji ID from all cached emojis
module.exports = async (context) => {
  if (!context.client) return '[error: $randomEmojiID — no client available]';
  const ids = [...context.client.emojis.cache.keys()];
  if (!ids.length) return '';
  return ids[Math.floor(Math.random() * ids.length)];
};
