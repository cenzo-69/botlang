'use strict';

// $purge[amount]
// Bulk-deletes messages in the current channel (max 100 per call).
// Discord only allows bulk delete for messages less than 14 days old.
// Returns the number of messages deleted, or an error string.
module.exports = async (context, args) => {
  const channel = context.message?.channel;
  if (!channel) return '[error: no channel]';
  const amount = Math.max(1, Math.min(100, parseInt(args[0]) || 1));
  try {
    const messages = await channel.messages.fetch({ limit: amount });
    const deleted  = await channel.bulkDelete(messages, true); // true = filter old msgs
    return String(deleted.size);
  } catch (err) {
    return `[error: ${err.message}]`;
  }
};
