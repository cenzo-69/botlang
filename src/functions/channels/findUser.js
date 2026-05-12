'use strict';

// $findUser[ID/Username/Mention;(fallbackToAuthor)]
// Resolves a user by mention, ID, or username and returns their ID.
// fallbackToAuthor=true (default) returns the author's ID if nothing matches.
module.exports = async (context, args) => {
  const query    = String(args[0] || '').trim();
  const fallback = String(args[1] || 'true').trim().toLowerCase() !== 'false';

  const mentionMatch = query.match(/^<@!?(\d+)>$/);
  if (mentionMatch) return mentionMatch[1];

  if (/^\d{15,20}$/.test(query)) return query;

  const guild = context.message?.guild;
  if (guild && query) {
    await guild.members.fetch().catch(() => {});
    const member = guild.members.cache.find(
      m => m.user.username.toLowerCase() === query.toLowerCase() ||
           m.displayName.toLowerCase()   === query.toLowerCase()
    );
    if (member) return member.id;
  }

  if (fallback) return context.message?.author?.id ?? '';
  return '[error: user not found]';
};
