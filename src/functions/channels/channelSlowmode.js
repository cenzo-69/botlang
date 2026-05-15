'use strict';
// $channelSlowmode[channelID?]  — returns slowmode delay in seconds (0 = off)
module.exports = async (context, args) => {
  const id = String(args[0] !== undefined ? args[0] : '').trim();
  try {
    const ch = id ? await context.client?.channels.fetch(id) : context.message?.channel;
    if (!ch) return '[error: Channel not found!]';
    return String(ch.rateLimitPerUser ?? 0);
  } catch (err) { return `[error: ${err.message}!]`; }
};
