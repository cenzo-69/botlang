'use strict';

// $serverDescription[(guildID)]
// Returns the description of the current (or specified) guild.
module.exports = async (context, args) => {
  const guildID = String(args[0] || '').trim();
  if (guildID) {
    try {
      const guild = await context.client.guilds.fetch(guildID);
      return guild.description ?? '';
    } catch { return '[error: guild not found]'; }
  }
  return context.message?.guild?.description ?? '';
};
