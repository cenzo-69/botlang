'use strict';
// $emojiRoles[emojiID;separator?]  — returns role IDs that can use this emoji
module.exports = async (context, args) => {
  const id  = String(args[0] !== undefined ? args[0] : '').trim();
  const sep = String(args[1] !== undefined ? args[1] : ', ');
  if (!id) return '[error: $emojiRoles — emojiID is required]';
  try {
    const emoji = context.client?.emojis.cache.get(id);
    if (!emoji) return '[error: $emojiRoles — emoji not found]';
    return [...(emoji.roles?.cache.keys() ?? [])].join(sep);
  } catch (err) { return `[error: $emojiRoles — ${err.message}]`; }
};
