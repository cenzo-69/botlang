'use strict';

const { argError } = require('../../core/fnError');
// $emojiID[emojiName]  — returns the ID of a custom emoji by name
module.exports = async (context, args) => {
  const name = String(args[0] !== undefined ? args[0] : '').trim();
  if (!name) return argError(context, 'name', 'string', name);
  try {
    const emoji = context.client?.emojis.cache.find(e => e.name?.toLowerCase() === name.toLowerCase());
    return emoji?.id ?? '';
  } catch (err) { return `[error: ${err.message}!]`; }
};
