'use strict';

const { argError } = require('../../core/fnError');
// $cloneChannel[channelID;name?]  — clones a channel and returns the new channel ID
module.exports = async (context, args) => {
  const id   = String(args[0] !== undefined ? args[0] : '').trim();
  const name = args[1] !== undefined ? String(args[1]).trim() : undefined;
  if (!id) return argError(context, 'id', 'string', id);
  try {
    const ch    = await context.client?.channels.fetch(id);
    if (!ch)    return '[error: Channel not found!]';
    const clone = await ch.clone({ name });
    return clone.id;
  } catch (err) { return `[error: ${err.message}!]`; }
};
