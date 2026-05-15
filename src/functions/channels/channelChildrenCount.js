'use strict';

const { argError } = require('../../core/fnError');
// $channelChildrenCount[channelID]  — returns number of channels in a category
module.exports = async (context, args) => {
  const id = String(args[0] !== undefined ? args[0] : '').trim();
  if (!id) return argError(context, 'id', 'string', id);
  try {
    const ch = await context.client?.channels.fetch(id);
    if (!ch) return '[error: Channel not found!]';
    return String(ch.children?.cache.size ?? 0);
  } catch (err) { return `[error: ${err.message}!]`; }
};
