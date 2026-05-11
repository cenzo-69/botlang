'use strict';

// $setChannelName[channelID;newName]
// Renames a channel. Returns empty string on success.
module.exports = async (context, args) => {
  const id      = String(args[0] || '').trim();
  const newName = String(args[1] || '').trim();
  if (!id || !newName) return '[error: $setChannelName requires channelID and name]';
  try {
    const channel = await context.client.channels.fetch(id);
    await channel.setName(newName);
    return '';
  } catch (err) {
    return `[error: ${err.message}]`;
  }
};
