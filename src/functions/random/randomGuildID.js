'use strict';

// $randomGuildID  — returns the current guild ID (or a random guild from the bot's cache)
// With no args: returns the current guild ID.
// With arg "any": returns a random guild ID the bot is in.
module.exports = async (context, args) => {
  if (args[0] === 'any' && context.client) {
    const guilds = [...context.client.guilds.cache.values()];
    if (!guilds.length) return '[randomGuildID error: no guilds]';
    return guilds[Math.floor(Math.random() * guilds.length)].id;
  }
  return context.message?.guild?.id || '[randomGuildID error: no guild]';
};
