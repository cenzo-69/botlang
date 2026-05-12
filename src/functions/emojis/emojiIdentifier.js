'use strict';
// $emojiIdentifier[emojiID]  — returns name:id identifier string
module.exports = async (context, args) => {
  const id = String(args[0] !== undefined ? args[0] : '').trim();
  if (!id) return '[error: $emojiIdentifier — emojiID is required]';
  try {
    const emoji = context.client?.emojis.cache.get(id);
    if (!emoji) return '[error: $emojiIdentifier — emoji not found]';
    return emoji.identifier;
  } catch (err) { return `[error: $emojiIdentifier — ${err.message}]`; }
};
