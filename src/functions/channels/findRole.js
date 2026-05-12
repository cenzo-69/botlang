'use strict';

// $findRole[ID/Name/Mention]
// Resolves a role by mention, ID, or name and returns its ID.
module.exports = async (context, args) => {
  const query = String(args[0] || '').trim();
  const guild = context.message?.guild;
  if (!query || !guild) return '[error: $findRole requires a query and a guild]';

  const mentionMatch = query.match(/^<@&(\d+)>$/);
  if (mentionMatch) return mentionMatch[1];

  if (/^\d{15,20}$/.test(query)) {
    return guild.roles.cache.has(query) ? query : '[error: role not found]';
  }

  const role = guild.roles.cache.find(r => r.name.toLowerCase() === query.toLowerCase());
  return role?.id ?? '[error: role not found]';
};
