'use strict';
// $findEmoji[query]  — finds an emoji by name or ID across all guilds
module.exports = async (context, args) => {
  const query = String(args[0] !== undefined ? args[0] : '').trim();
  if (!query) return '[error: $findEmoji — query is required]';
  if (!context.client) return '[error: $findEmoji — no client available]';
  const q     = query.toLowerCase();
  const emoji = context.client.emojis.cache.find(e =>
    e.id === query || e.name?.toLowerCase().includes(q)
  );
  return emoji?.id ?? '';
};
