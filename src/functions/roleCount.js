'use strict';

// $roleCount  — total number of roles in the server (includes @everyone)
module.exports = async (context, args) => {
  if (!context.message?.guild) return '[error: no guild]';
  return String(context.message.guild.roles.cache.size);
};
