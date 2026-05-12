'use strict';
// $threadIsArchived[channelID]  — returns "true" if the thread is archived
module.exports = async (context, args) => {
  const id = String(args[0] !== undefined ? args[0] : '').trim();
  if (!id) return '[error: $threadIsArchived — channelID is required]';
  try {
    const ch = await context.client?.channels.fetch(id);
    if (!ch) return '[error: $threadIsArchived — thread not found]';
    return String(ch.archived ?? false);
  } catch (err) { return `[error: $threadIsArchived — ${err.message}]`; }
};
