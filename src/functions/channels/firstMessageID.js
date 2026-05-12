'use strict';
// $firstMessageID[channelID?]  — returns the ID of the first message sent in a channel
module.exports = async (context, args) => {
  const id = String(args[0] !== undefined ? args[0] : '').trim();
  try {
    const ch = id ? await context.client?.channels.fetch(id) : context.message?.channel;
    if (!ch) return '[error: $firstMessageID — channel not found]';
    const msgs = await ch.messages.fetch({ limit: 1, after: '0' });
    return msgs.first()?.id ?? '';
  } catch (err) { return `[error: $firstMessageID — ${err.message}]`; }
};
