'use strict';

// $setBotActivity[text;type?]
// Set the bot's activity. Type: Playing (default) | Watching | Listening | Streaming | Competing
module.exports = async (context, args) => {
  const text = String(args[0] ?? '').trim();
  const type = String(args[1] ?? 'Playing').trim();

  const typeMap = {
    playing:   0,
    streaming: 1,
    listening: 2,
    watching:  3,
    competing: 5,
  };

  const activityType = typeMap[type.toLowerCase()];
  if (activityType === undefined) return `[setBotActivity error: unknown type "${type}"]`;
  if (!context.client) return '';

  try {
    context.client.user.setActivity(text, { type: activityType });
  } catch (e) {
    return `[setBotActivity error: ${e.message}]`;
  }
  return '';
};
