'use strict';

const { ChannelType } = require('discord.js');

// $categoryID[categoryName]
// Returns the ID of a category channel by name.
module.exports = async (context, args) => {
  const name  = String(args[0] || '').trim();
  if (!name) return '[error: $categoryID requires a category name]';
  const guild = context.message?.guild;
  if (!guild) return '[error: no guild]';
  const cat = guild.channels.cache.find(
    c => c.type === ChannelType.GuildCategory && c.name.toLowerCase() === name.toLowerCase()
  );
  return cat?.id ?? '[error: category not found]';
};
