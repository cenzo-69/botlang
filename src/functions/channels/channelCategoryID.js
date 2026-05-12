'use strict';
// $channelCategoryID[channelID?]  — returns parent category ID, or empty string
module.exports = async (context, args) => {
  const id = String(args[0] !== undefined ? args[0] : '').trim();
  try {
    const ch = id
      ? await context.client?.channels.fetch(id)
      : context.message?.channel;
    if (!ch) return '[error: $channelCategoryID — channel not found]';
    return ch.parentId ?? '';
  } catch (err) { return `[error: $channelCategoryID — ${err.message}]`; }
};
