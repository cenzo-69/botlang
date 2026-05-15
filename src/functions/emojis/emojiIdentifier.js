'use strict';

const { argError } = require('../../core/fnError');
// $emojiIdentifier[emojiID]  — returns name:id identifier string
module.exports = async (context, args) => {
  const id = String(args[0] !== undefined ? args[0] : '').trim();
  if (!id) return argError(context, 'id', 'string', id);
  try {
    const emoji = context.client?.emojis.cache.get(id);
    if (!emoji) return '[error: Emoji not found!]';
    return emoji.identifier;
  } catch (err) { return `[error: ${err.message}!]`; }
};
