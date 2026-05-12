'use strict';
// $emojiURL[emojiID]  — returns the CDN URL for a custom emoji
module.exports = async (context, args) => {
  const id = String(args[0] !== undefined ? args[0] : '').trim();
  if (!id) return '[error: $emojiURL — emojiID is required]';
  try {
    const emoji = context.client?.emojis.cache.get(id);
    if (!emoji) return `https://cdn.discordapp.com/emojis/${id}.png`;
    return emoji.url;
  } catch { return `https://cdn.discordapp.com/emojis/${id}.png`; }
};
