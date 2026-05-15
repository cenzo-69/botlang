'use strict';

const { argError } = require('../../core/fnError');
// $threadIsArchived[channelID]  — returns "true" if the thread is archived
module.exports = async (context, args) => {
  const id = String(args[0] !== undefined ? args[0] : '').trim();
  if (!id) return argError(context, 'id', 'string', id);
  try {
    const ch = await context.client?.channels.fetch(id);
    if (!ch) return '[error: Thread not found!]';
    return String(ch.archived ?? false);
  } catch (err) { return `[error: ${err.message}!]`; }
};
