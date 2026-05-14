'use strict';

const { argError } = require('../../core/fnError');

// $slowmode[channelID;seconds]
// Sets the slowmode (rate limit) on a channel. 0 disables it.
// Max: 21600 seconds (6 hours).
module.exports = async (context, args) => {
  const id      = String(args[0] || '').trim();
  const seconds = Math.max(0, Math.min(21600, parseInt(args[1]) || 0));
  if (!id) return argError(context, 'id', 'string', id);
  try {
    const channel = await context.client.channels.fetch(id);
    await channel.setRateLimitPerUser(seconds);
    return '';
  } catch (err) {
    return `[error: ${err.message}]`;
  }
};
