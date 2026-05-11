'use strict';

// $randomMention  — mentions a random guild member
module.exports = async (context, args) => {
  const guild = context.message?.guild;
  if (!guild) return '[randomMention error: no guild]';
  try {
    const members = await guild.members.fetch();
    const arr     = [...members.values()].filter(m => !m.user.bot);
    if (!arr.length) return '[randomMention error: no members]';
    const picked = arr[Math.floor(Math.random() * arr.length)];
    return `<@${picked.user.id}>`;
  } catch (err) {
    return `[randomMention error: ${err.message}]`;
  }
};
