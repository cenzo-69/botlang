'use strict';
// $channelChildrenIDs[channelID;separator?]  — returns channel IDs in a category
module.exports = async (context, args) => {
  const id  = String(args[0] !== undefined ? args[0] : '').trim();
  const sep = String(args[1] !== undefined ? args[1] : ', ');
  if (!id) return '[error: $channelChildrenIDs — channelID is required]';
  try {
    const ch = await context.client?.channels.fetch(id);
    if (!ch) return '[error: $channelChildrenIDs — channel not found]';
    return [...(ch.children?.cache.keys() ?? [])].join(sep);
  } catch (err) { return `[error: $channelChildrenIDs — ${err.message}]`; }
};
