'use strict';
// $startTyping[channelID?]  — starts the typing indicator in a channel
module.exports = async (context, args) => {
  const id = String(args[0] !== undefined ? args[0] : '').trim();
  try {
    const ch = id ? await context.client?.channels.fetch(id) : context.message?.channel;
    if (!ch) return '[error: Channel not found!]';
    await ch.sendTyping();
    return '';
  } catch (err) { return `[error: ${err.message}!]`; }
};
