'use strict';

// $mentioned[index;fallbackToAuthor]
// index: 1-based (default 1)
// fallbackToAuthor: true/false (default false)
module.exports = async (context, args) => {
  if (!context.message) return '[no message]';

  const index = Math.max(0, (parseInt(args[0]) || 1) - 1);
  const fallback = String(args[1]).toLowerCase() === 'true';

  const mentions = [...context.message.mentions.users.values()];
  const user = mentions[index];

  if (!user) {
    if (fallback) return context.message.author.id;
    return '[no mention]';
  }

  return user.id;
};
