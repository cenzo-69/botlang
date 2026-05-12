'use strict';

const { StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');

// $addStringSelect[menuID;placeholder;minValues;maxValues;disabled?;actionRowID?]
// Creates a string select menu (dropdown) component.
// Use $addStringSelectOption after this to populate choices.
module.exports = async (context, args) => {
  const menuID      = String(args[0] !== undefined ? args[0] : '').trim();
  const placeholder = String(args[1] !== undefined ? args[1] : '').trim() || 'Select an option';
  const minValues   = parseInt(args[2]) || 1;
  const maxValues   = parseInt(args[3]) || 1;
  const disabled    = String(args[4] !== undefined ? args[4] : '').trim().toLowerCase() === 'true';
  const rowID       = parseInt(args[5]) || 0;

  if (!menuID) return '[error: $addStringSelect requires a menuID]';

  const select = new StringSelectMenuBuilder()
    .setCustomId(menuID)
    .setPlaceholder(placeholder)
    .setMinValues(Math.max(0, minValues))
    .setMaxValues(Math.max(1, maxValues))
    .setDisabled(disabled);

  const menus = context.variables.get('__select_menus__') || {};
  menus[menuID] = { builder: select, rowID };
  context.variables.set('__select_menus__', menus);
  return '';
};
