'use strict';

// $eventUserCount[eventID]
// Returns the number of users subscribed to a scheduled event.
module.exports = async (context, args) => {
  const eventID = String(args[0] !== undefined ? args[0] : '').trim();
  if (!eventID) return '[error: $eventUserCount requires an eventID]';
  if (!context.message?.guild) return '[error: $eventUserCount — not in a guild]';

  try {
    const event = await context.message.guild.scheduledEvents.fetch(eventID);
    return String(event.userCount ?? 0);
  } catch (err) {
    return `[error: $eventUserCount — ${err.message}]`;
  }
};
