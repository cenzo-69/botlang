'use strict';

const { argError } = require('../../core/fnError');

// $modifyChannel[channelID;name?;topic?;nsfw?;slowmode?;categoryID?;reason?]
// Edits multiple channel properties in one call. Pass empty string to skip a field.
module.exports = async (context, args) => {
  const channelID  = String(args[0] !== undefined ? args[0] : '').trim();
  const name       = String(args[1] !== undefined ? args[1] : '').trim();
  const topic      = String(args[2] !== undefined ? args[2] : '').trim();
  const nsfwRaw    = String(args[3] !== undefined ? args[3] : '').trim().toLowerCase();
  const slowmodeRaw= String(args[4] !== undefined ? args[4] : '').trim();
  const categoryID = String(args[5] !== undefined ? args[5] : '').trim();
  const reason     = String(args[6] !== undefined ? args[6] : '').trim() || 'No reason provided';

  if (!channelID) return argError(context, 'channel ID', 'TextChannel', channelID);
  if (!context.client) return '[error: $modifyChannel — no client]';

  try {
    const channel = await context.client.channels.fetch(channelID);
    if (!channel) return '[error: $modifyChannel — channel not found]';

    const edits = {};
    if (name)                               edits.name     = name;
    if (topic)                              edits.topic    = topic;
    if (nsfwRaw === 'true' || nsfwRaw === 'false') edits.nsfw = nsfwRaw === 'true';
    if (slowmodeRaw !== '') {
      const s = parseInt(slowmodeRaw);
      if (!isNaN(s)) edits.rateLimitPerUser = s;
    }
    if (categoryID)                         edits.parent   = categoryID;

    await channel.edit(edits, reason);
    return '';
  } catch (err) {
    return `[error: $modifyChannel — ${err.message}]`;
  }
};
