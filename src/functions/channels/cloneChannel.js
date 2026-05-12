'use strict';
// $cloneChannel[channelID;name?]  — clones a channel and returns the new channel ID
module.exports = async (context, args) => {
  const id   = String(args[0] !== undefined ? args[0] : '').trim();
  const name = args[1] !== undefined ? String(args[1]).trim() : undefined;
  if (!id) return '[error: $cloneChannel — channelID is required]';
  try {
    const ch    = await context.client?.channels.fetch(id);
    if (!ch)    return '[error: $cloneChannel — channel not found]';
    const clone = await ch.clone({ name });
    return clone.id;
  } catch (err) { return `[error: $cloneChannel — ${err.message}]`; }
};
