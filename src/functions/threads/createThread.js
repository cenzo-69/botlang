'use strict';

const { argError } = require('../../core/fnError');

// $createThread[name;messageID?;channelID?;autoArchiveMinutes?]
// Creates a thread on a message (or a standalone thread in a forum/text channel).
// autoArchiveMinutes: 60 | 1440 | 4320 | 10080 (default: 1440)
// Returns the new thread ID.
module.exports = async (context, args) => {
  const name          = String(args[0] !== undefined ? args[0] : '').trim();
  const messageID     = String(args[1] !== undefined ? args[1] : '').trim();
  const channelID     = String(args[2] !== undefined ? args[2] : '').trim();
  const autoArchive   = parseInt(args[3]) || 1440;

  if (!name) return argError(context, 'name', 'string', name);
  if (!context.client) return '[error: $createThread — no client available]';

  try {
    const channel = channelID
      ? await context.client.channels.fetch(channelID)
      : context.message?.channel;

    if (!channel) return '[error: $createThread — channel not found]';

    let thread;
    if (messageID) {
      const msg = await channel.messages.fetch(messageID);
      thread = await msg.startThread({ name, autoArchiveDuration: autoArchive });
    } else {
      thread = await channel.threads.create({ name, autoArchiveDuration: autoArchive });
    }

    return thread.id;
  } catch (err) {
    return `[error: $createThread — ${err.message}]`;
  }
};
