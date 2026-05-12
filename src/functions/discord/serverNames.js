'use strict';

// $serverNames[(amount;separator)]
// Returns a list of server names the bot is in.
module.exports = async (context, args) => {
  const amount = parseInt(args[0]) || 0;
  const sep    = String(args[1] !== undefined ? args[1] : ', ');
  const guilds = [...context.client.guilds.cache.values()];
  const list   = amount > 0 ? guilds.slice(0, amount) : guilds;
  return list.map(g => g.name).join(sep);
};
