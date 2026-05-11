'use strict';

// $randomUser  — returns a random guild member's username
module.exports = async (context, args) => {
  const guild = context.message?.guild;
  if (!guild) return '[randomUser error: no guild]';
  try {
    const members = await guild.members.fetch();
    const arr     = [...members.values()].filter(m => !m.user.bot);
    if (!arr.length) return '[randomUser error: no members]';
    const picked = arr[Math.floor(Math.random() * arr.length)];
    return picked.user.username;
  } catch (err) {
    return `[randomUser error: ${err.message}]`;
  }
};
