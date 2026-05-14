'use strict';

const { argError } = require('../../core/fnError');
// $emojiCreatedAt[emojiID]  — returns ISO creation date of the emoji
module.exports = async (context, args) => {
  const id = String(args[0] !== undefined ? args[0] : '').trim();
  if (!id) return argError(context, 'id', 'string', id);
  try {
    const emoji = context.client?.emojis.cache.get(id);
    if (!emoji) return '[error: $emojiCreatedAt — emoji not found]';
    return emoji.createdAt.toISOString();
  } catch (err) { return `[error: $emojiCreatedAt — ${err.message}]`; }
};
