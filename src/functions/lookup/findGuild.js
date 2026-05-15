'use strict';

const { argError } = require('../../core/fnError');
// $findGuild[query;returnGuild?]  — finds a guild by name or ID
module.exports = async (context, args) => {
  const query = String(args[0] !== undefined ? args[0] : '').trim();
  const ret   = String(args[1] !== undefined ? args[1] : 'id').toLowerCase();
  if (!query) return argError(context, 'query', 'string', query);
  if (!context.client) return '[error: No client available!]';
  const guild = context.client.guilds.cache.find(g =>
    g.id === query || g.name.toLowerCase().includes(query.toLowerCase())
  );
  if (!guild) return '';
  switch (ret) {
    case 'name':  return guild.name;
    case 'owner': return guild.ownerId;
    default:      return guild.id;
  }
};
