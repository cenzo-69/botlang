'use strict';
// $channelBitrate[channelID]  — returns bitrate of a voice channel in kbps
module.exports = async (context, args) => {
  const id = String(args[0] !== undefined ? args[0] : '').trim();
  if (!id) return '[error: $channelBitrate — channelID is required]';
  try {
    const ch = await context.client?.channels.fetch(id);
    if (!ch) return '[error: $channelBitrate — channel not found]';
    return String(ch.bitrate != null ? ch.bitrate / 1000 : 0);
  } catch (err) { return `[error: $channelBitrate — ${err.message}]`; }
};
