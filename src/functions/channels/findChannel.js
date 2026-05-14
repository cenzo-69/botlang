'use strict';

const { argError } = require('../../core/fnError');

// $findChannel[ID/Name/Mention]
// Resolves a channel by mention, ID, or name and returns its ID.
module.exports = async (context, args) => {
  const query = String(args[0] || '').trim();
  const guild = context.message?.guild;
  if (!query) return argError(context, 'query', 'string', query);

  const mentionMatch = query.match(/^<#(\d+)>$/);
  if (mentionMatch) return mentionMatch[1];

  if (/^\d{15,20}$/.test(query)) {
    return (guild?.channels.cache.has(query)) ? query : '[error: channel not found]';
  }

  if (guild) {
    const ch = guild.channels.cache.find(c => c.name.toLowerCase() === query.toLowerCase());
    if (ch) return ch.id;
  }
  return '[error: channel not found]';
};
