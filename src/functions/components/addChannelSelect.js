'use strict';

const { ChannelSelectMenuBuilder, ActionRowBuilder, ChannelType } = require('discord.js');

const CHANNEL_TYPE_MAP = {
  text:         ChannelType.GuildText,
  voice:        ChannelType.GuildVoice,
  category:     ChannelType.GuildCategory,
  announcement: ChannelType.GuildAnnouncement,
  thread:       ChannelType.PublicThread,
  stage:        ChannelType.GuildStageVoice,
  forum:        ChannelType.GuildForum,
};

// $addChannelSelect[menuID;placeholder;minValues;maxValues;disabled?;actionRowID?;channelTypes?]
// Creates a channel select menu. channelTypes is a comma-separated list (text,voice,etc.)
module.exports = async (context, args) => {
  const menuID       = String(args[0] !== undefined ? args[0] : '').trim();
  const placeholder  = String(args[1] !== undefined ? args[1] : '').trim() || 'Select a channel';
  const minValues    = parseInt(args[2]) || 1;
  const maxValues    = parseInt(args[3]) || 1;
  const disabled     = String(args[4] !== undefined ? args[4] : '').trim().toLowerCase() === 'true';
  const rowID        = parseInt(args[5]) || 0;
  const typesRaw     = String(args[6] !== undefined ? args[6] : '').trim();

  if (!menuID) return '[error: $addChannelSelect requires a menuID]';

  const select = new ChannelSelectMenuBuilder()
    .setCustomId(menuID)
    .setPlaceholder(placeholder)
    .setMinValues(Math.max(0, minValues))
    .setMaxValues(Math.max(1, maxValues))
    .setDisabled(disabled);

  if (typesRaw) {
    const types = typesRaw.split(',').map(t => CHANNEL_TYPE_MAP[t.trim().toLowerCase()]).filter(Boolean);
    if (types.length) select.setChannelTypes(types);
  }

  const components = context.variables.get('__components__') || [];
  while (components.length <= rowID) components.push(new ActionRowBuilder());
  components[rowID].addComponents(select);
  context.variables.set('__components__', components);
  return '';
};
