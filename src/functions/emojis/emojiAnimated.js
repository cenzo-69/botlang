'use strict';

const { argError } = require('../../core/fnError');
// $emojiAnimated[emojiID]  — returns "true" if the emoji is animated
module.exports = async (context, args) => {
  const id = String(args[0] !== undefined ? args[0] : '').trim();
  if (!id) return argError(context, 'id', 'string', id);
  try {
    const emoji = context.client?.emojis.cache.get(id);
    if (!emoji) return '[error: Emoji not found!]';
    return String(emoji.animated);
  } catch (err) { return `[error: ${err.message}!]`; }
};
