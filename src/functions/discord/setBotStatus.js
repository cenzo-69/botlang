'use strict';

// $setBotStatus[status]
// Set the bot's online status: online | idle | dnd | invisible
module.exports = async (context, args) => {
  const status = String(args[0] ?? 'online').toLowerCase().trim();
  const valid = ['online', 'idle', 'dnd', 'invisible'];
  if (!valid.includes(status)) return `[setBotStatus error: must be one of ${valid.join(', ')}]`;
  if (!context.client) return '';
  try {
    context.client.user.setStatus(status);
  } catch (e) {
    return `[setBotStatus error: ${e.message}]`;
  }
  return '';
};
