'use strict';
// $emoji[emojiID]  — formats an emoji as <:name:id> or <a:name:id>
module.exports = async (context, args) => {
  const id = String(args[0] !== undefined ? args[0] : '').trim();
  if (!id) return '[error: $emoji — emojiID is required]';
  if (!context.client) return `<:unknown:${id}>`;
  try {
    const emoji = context.client.emojis.cache.get(id);
    if (!emoji) return `<:unknown:${id}>`;
    return emoji.animated ? `<a:${emoji.name}:${emoji.id}>` : `<:${emoji.name}:${emoji.id}>`;
  } catch { return `<:unknown:${id}>`; }
};
