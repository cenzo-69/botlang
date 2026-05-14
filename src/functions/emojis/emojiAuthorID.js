'use strict';

const { argError } = require('../../core/fnError');
// $emojiAuthorID[emojiID]  — returns the user ID who created the emoji
module.exports = async (context, args) => {
  const id = String(args[0] !== undefined ? args[0] : '').trim();
  if (!id) return argError(context, 'id', 'string', id);
  try {
    const emoji = context.client?.emojis.cache.get(id);
    if (!emoji) return '[error: $emojiAuthorID — emoji not found]';
    const fetched = await emoji.fetchAuthor().catch(() => null);
    return fetched?.id ?? '';
  } catch (err) { return `[error: $emojiAuthorID — ${err.message}]`; }
};
