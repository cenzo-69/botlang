'use strict';
// $channelVoiceRegion[channelID?]  — returns voice channel RTC region
module.exports = async (context, args) => {
  const id = String(args[0] !== undefined ? args[0] : '').trim();
  try {
    const ch = id ? await context.client?.channels.fetch(id) : context.message?.channel;
    if (!ch) return '[error: $channelVoiceRegion — channel not found]';
    return ch.rtcRegion ?? 'automatic';
  } catch (err) { return `[error: $channelVoiceRegion — ${err.message}]`; }
};
