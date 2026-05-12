'use strict';

// $parentID[channelID?]
// Returns the ID of the category (parent) a channel belongs to.
// Returns empty string if the channel has no parent category.
module.exports = async (context, args) => {
  const channelID = String(args[0] !== undefined ? args[0] : '').trim();
  if (!context.client) return '[error: $parentID — no client]';

  try {
    const channel = channelID
      ? await context.client.channels.fetch(channelID)
      : context.message?.channel;
    if (!channel) return '[error: $parentID — channel not found]';
    return channel.parentId ?? '';
  } catch (err) {
    return `[error: $parentID — ${err.message}]`;
  }
};
