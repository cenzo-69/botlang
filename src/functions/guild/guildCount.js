'use strict';
// $guildCount  — returns the number of guilds the bot is in
module.exports = async (context) => {
  if (!context.client) return '[error: $guildCount — no client available]';
  return String(context.client.guilds.cache.size);
};
