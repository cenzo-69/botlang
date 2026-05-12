'use strict';

const { UserSelectMenuBuilder, ActionRowBuilder } = require('discord.js');

// $addUserSelect[menuID;placeholder;minValues;maxValues;disabled?;actionRowID?]
// Creates a user select menu component.
module.exports = async (context, args) => {
  const menuID      = String(args[0] !== undefined ? args[0] : '').trim();
  const placeholder = String(args[1] !== undefined ? args[1] : '').trim() || 'Select a user';
  const minValues   = parseInt(args[2]) || 1;
  const maxValues   = parseInt(args[3]) || 1;
  const disabled    = String(args[4] !== undefined ? args[4] : '').trim().toLowerCase() === 'true';
  const rowID       = parseInt(args[5]) || 0;

  if (!menuID) return '[error: $addUserSelect requires a menuID]';

  const select = new UserSelectMenuBuilder()
    .setCustomId(menuID)
    .setPlaceholder(placeholder)
    .setMinValues(Math.max(0, minValues))
    .setMaxValues(Math.max(1, maxValues))
    .setDisabled(disabled);

  const components = context.variables.get('__components__') || [];
  while (components.length <= rowID) components.push(new ActionRowBuilder());
  components[rowID].addComponents(select);
  context.variables.set('__components__', components);
  return '';
};
