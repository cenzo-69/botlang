'use strict';
// $channelChildrenCount[channelID]  — returns number of channels in a category
module.exports = async (context, args) => {
  const id = String(args[0] !== undefined ? args[0] : '').trim();
  if (!id) return '[error: $channelChildrenCount — channelID is required]';
  try {
    const ch = await context.client?.channels.fetch(id);
    if (!ch) return '[error: $channelChildrenCount — channel not found]';
    return String(ch.children?.cache.size ?? 0);
  } catch (err) { return `[error: $channelChildrenCount — ${err.message}]`; }
};
