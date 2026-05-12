'use strict';

const { ChannelType } = require('discord.js');

// $categoryChannels[categoryID;separator;(option)]
// Returns channels inside a category. option: "name" (default) or "id"
module.exports = async (context, args) => {
  const categoryRef = String(args[0] || '').trim();
  const sep         = String(args[1] !== undefined ? args[1] : ', ');
  const option      = String(args[2] || 'name').trim().toLowerCase();
  const guild       = context.message?.guild;
  if (!guild || !categoryRef) return '[error: $categoryChannels requires a category ID or name]';

  let cat = guild.channels.cache.get(categoryRef);
  if (!cat) {
    cat = guild.channels.cache.find(
      c => c.type === ChannelType.GuildCategory && c.name.toLowerCase() === categoryRef.toLowerCase()
    );
  }
  if (!cat) return '[error: category not found]';

  const channels = guild.channels.cache.filter(c => c.parentId === cat.id);
  return [...channels.values()].map(c => option === 'id' ? c.id : c.name).join(sep);
};
