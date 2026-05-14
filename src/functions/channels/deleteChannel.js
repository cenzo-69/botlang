'use strict';

const { argError } = require('../../core/fnError');

// $deleteChannel[channelID]
// Deletes the given channel. Returns empty string on success.
module.exports = async (context, args) => {
  const id = String(args[0] || '').trim();
  if (!id) return argError(context, 'id', 'string', id);
  try {
    const channel = await context.client.channels.fetch(id);
    await channel.delete();
    return '';
  } catch (err) {
    return `[error: ${err.message}]`;
  }
};
