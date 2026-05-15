'use strict';

const { argError } = require('../../core/fnError');
// $threadOwnerID[channelID]  — returns the user ID of the thread owner
module.exports = async (context, args) => {
  const id = String(args[0] !== undefined ? args[0] : '').trim();
  if (!id) return argError(context, 'id', 'string', id);
  try {
    const ch = await context.client?.channels.fetch(id);
    if (!ch) return '[error: Thread not found!]';
    return ch.ownerId ?? '';
  } catch (err) { return `[error: ${err.message}!]`; }
};
