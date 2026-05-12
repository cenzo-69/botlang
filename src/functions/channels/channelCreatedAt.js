'use strict';
// $channelCreatedAt[channelID?]  — returns channel creation date as ISO string
module.exports = async (context, args) => {
  const id = String(args[0] !== undefined ? args[0] : '').trim();
  try {
    const ch = id ? await context.client?.channels.fetch(id) : context.message?.channel;
    if (!ch) return '[error: $channelCreatedAt — channel not found]';
    return ch.createdAt?.toISOString() ?? '';
  } catch (err) { return `[error: $channelCreatedAt — ${err.message}]`; }
};
