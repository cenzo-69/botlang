'use strict';
// $setStatus[type;text;status?]  — sets bot presence
// type: Playing|Watching|Listening|Streaming|Competing
// status: online|idle|dnd|invisible (default: online)
module.exports = async (context, args) => {
  const type   = String(args[0] !== undefined ? args[0] : 'Playing').trim();
  const text   = String(args[1] !== undefined ? args[1] : '').trim();
  const status = String(args[2] !== undefined ? args[2] : 'online').toLowerCase();
  if (!context.client) return '[error: $setStatus — no client available]';
  const typeMap = {
    playing: 0, streaming: 1, listening: 2, watching: 3, competing: 5,
  };
  const typeNum = typeMap[type.toLowerCase()] ?? 0;
  try {
    context.client.user.setPresence({
      activities: [{ name: text || 'CenzoJS', type: typeNum }],
      status,
    });
    return '';
  } catch (err) { return `[error: $setStatus — ${err.message}]`; }
};
