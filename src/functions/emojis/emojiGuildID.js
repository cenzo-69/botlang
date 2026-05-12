'use strict';
// $emojiGuildID[emojiID]  — returns the guild ID where the emoji belongs
module.exports = async (context, args) => {
  const id = String(args[0] !== undefined ? args[0] : '').trim();
  if (!id) return '[error: $emojiGuildID — emojiID is required]';
  try {
    const emoji = context.client?.emojis.cache.get(id);
    if (!emoji) return '[error: $emojiGuildID — emoji not found]';
    return emoji.guild?.id ?? '';
  } catch (err) { return `[error: $emojiGuildID — ${err.message}]`; }
};
