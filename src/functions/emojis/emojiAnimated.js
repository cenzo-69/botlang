'use strict';
// $emojiAnimated[emojiID]  — returns "true" if the emoji is animated
module.exports = async (context, args) => {
  const id = String(args[0] !== undefined ? args[0] : '').trim();
  if (!id) return '[error: $emojiAnimated — emojiID is required]';
  try {
    const emoji = context.client?.emojis.cache.get(id);
    if (!emoji) return '[error: $emojiAnimated — emoji not found]';
    return String(emoji.animated);
  } catch (err) { return `[error: $emojiAnimated — ${err.message}]`; }
};
