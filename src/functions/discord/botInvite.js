'use strict';
// $botInvite[perms]  — returns a bot invite link with given permission flags
module.exports = async (context, args) => {
  const perms = String(args[0] !== undefined ? args[0] : '8').trim();
  const id = context.client?.user?.id;
  if (!id) return '[error: $botInvite — no client available]';
  return `https://discord.com/api/oauth2/authorize?client_id=${id}&permissions=${perms}&scope=bot+applications.commands`;
};
