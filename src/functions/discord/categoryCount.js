'use strict';

const { ChannelType } = require('discord.js');

// $categoryCount[(guildID)]
// Returns the number of category channels in the guild.
module.exports = async (context, args) => {
  const guildID = String(args[0] || '').trim();
  let guild = context.message?.guild;
  if (guildID) {
    try { guild = await context.client.guilds.fetch(guildID); } catch { return '[error: guild not found]'; }
  }
  if (!guild) return '[error: no guild]';
  return String(guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory).size);
};
