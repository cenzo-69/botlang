'use strict';

// $randomUserID  — returns a random guild member's user ID
module.exports = async (context, args) => {
  const guild = context.message?.guild;
  if (!guild) return '[randomUserID error: no guild]';
  try {
    const members = await guild.members.fetch();
    const arr     = [...members.values()].filter(m => !m.user.bot);
    if (!arr.length) return '[randomUserID error: no members]';
    const picked = arr[Math.floor(Math.random() * arr.length)];
    return picked.user.id;
  } catch (err) {
    return `[randomUserID error: ${err.message}]`;
  }
};
