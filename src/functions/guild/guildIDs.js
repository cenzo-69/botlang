'use strict';
// $guildIDs[separator?]  — returns IDs of all guilds the bot is in
module.exports = async (context, args) => {
  const sep = String(args[0] !== undefined ? args[0] : ', ');
  if (!context.client) return '[error: No client available!]';
  return [...context.client.guilds.cache.keys()].join(sep);
};
