'use strict';

const { argError } = require('../../core/fnError');
// $channelBitrate[channelID]  — returns bitrate of a voice channel in kbps
module.exports = async (context, args) => {
  const id = String(args[0] !== undefined ? args[0] : '').trim();
  if (!id) return argError(context, 'id', 'string', id);
  try {
    const ch = await context.client?.channels.fetch(id);
    if (!ch) return '[error: Channel not found!]';
    return String(ch.bitrate != null ? ch.bitrate / 1000 : 0);
  } catch (err) { return `[error: ${err.message}!]`; }
};
