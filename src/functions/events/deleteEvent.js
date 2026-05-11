'use strict';

// $deleteEvent[eventID;reason?]
// Cancels and deletes a scheduled guild event by ID.
module.exports = async (context, args) => {
  const eventID = String(args[0] !== undefined ? args[0] : '').trim();
  const reason  = String(args[1] !== undefined ? args[1] : '').trim() || 'No reason provided';

  if (!eventID) return '[error: $deleteEvent requires an eventID]';
  if (!context.message?.guild) return '[error: $deleteEvent — not in a guild]';

  try {
    const event = await context.message.guild.scheduledEvents.fetch(eventID);
    await event.delete();
    return '';
  } catch (err) {
    return `[error: $deleteEvent — ${err.message}]`;
  }
};
