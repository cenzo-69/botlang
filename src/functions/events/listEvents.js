'use strict';

// $listEvents[separator?;format?]
// Returns a list of upcoming scheduled events.
// format: "id" (default) | "name" | "both" → "name (id)"
module.exports = async (context, args) => {
  const sep    = String(args[0] !== undefined ? args[0] : ', ');
  const format = String(args[1] !== undefined ? args[1] : '').trim().toLowerCase() || 'id';

  if (!context.message?.guild) return '[error: Not in a guild!]';

  try {
    const events = await context.message.guild.scheduledEvents.fetch();
    return [...events.values()].map(ev => {
      if (format === 'name') return ev.name;
      if (format === 'both') return `${ev.name} (${ev.id})`;
      return ev.id;
    }).join(sep);
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
