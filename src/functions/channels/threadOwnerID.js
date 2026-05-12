'use strict';
// $threadOwnerID[channelID]  — returns the user ID of the thread owner
module.exports = async (context, args) => {
  const id = String(args[0] !== undefined ? args[0] : '').trim();
  if (!id) return '[error: $threadOwnerID — channelID is required]';
  try {
    const ch = await context.client?.channels.fetch(id);
    if (!ch) return '[error: $threadOwnerID — thread not found]';
    return ch.ownerId ?? '';
  } catch (err) { return `[error: $threadOwnerID — ${err.message}]`; }
};
