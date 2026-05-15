'use strict';
// $channelPosition[channelID?]  — returns channel position integer
module.exports = async (context, args) => {
  const id = String(args[0] !== undefined ? args[0] : '').trim();
  try {
    const ch = id ? await context.client?.channels.fetch(id) : context.message?.channel;
    if (!ch) return '[error: Channel not found!]';
    return String(ch.position ?? 0);
  } catch (err) { return `[error: ${err.message}!]`; }
};
