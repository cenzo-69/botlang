'use strict';

const { argError } = require('../../core/fnError');
// $findChannel[query;returnChannel?]  — finds a channel by name or ID across all guilds
// returnChannel: "id" (default)|"name"|"type"
module.exports = async (context, args) => {
  const query  = String(args[0] !== undefined ? args[0] : '').trim();
  const ret    = String(args[1] !== undefined ? args[1] : 'id').toLowerCase();
  if (!query) return argError(context, 'query', 'string', query);
  if (!context.client) return '[error: $findChannel — no client available]';
  const ch = context.client.channels.cache.find(c =>
    c.id === query || c.name?.toLowerCase().includes(query.toLowerCase())
  );
  if (!ch) return '';
  switch (ret) {
    case 'name': return ch.name ?? '';
    case 'type': return String(ch.type);
    default:     return ch.id;
  }
};
