'use strict';

// $randomRoleID  — random role ID from the current guild cache
module.exports = async (context, args) => {
  if (!context.message?.guild) return '[error: no guild]';
  const roles = [...context.message.guild.roles.cache.values()];
  if (!roles.length) return '[error: empty role cache]';
  return roles[Math.floor(Math.random() * roles.length)].id;
};
