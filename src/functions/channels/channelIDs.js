'use strict';
// $channelIDs[separator?]  — returns all channel IDs the bot can see
module.exports = async (context, args) => {
  const sep = String(args[0] !== undefined ? args[0] : ', ');
  if (!context.client) return '[error: $channelIDs — no client available]';
  const ids = [];
  for (const guild of context.client.guilds.cache.values()) {
    ids.push(...guild.channels.cache.keys());
  }
  return ids.join(sep);
};
