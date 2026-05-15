'use strict';

const { argError } = require('../../core/fnError');

const { ActionRowBuilder } = require('discord.js');

// $addStringSelectOption[label;value;description?;emoji?;default?;menuID?]
// Adds an option to the most recently created string select menu (or a specific menu by ID).
module.exports = async (context, args) => {
  const label       = String(args[0] !== undefined ? args[0] : '').trim();
  const value       = String(args[1] !== undefined ? args[1] : '').trim();
  const description = String(args[2] !== undefined ? args[2] : '').trim();
  const emoji       = String(args[3] !== undefined ? args[3] : '').trim();
  const isDefault   = String(args[4] !== undefined ? args[4] : '').trim().toLowerCase() === 'true';
  const menuID      = String(args[5] !== undefined ? args[5] : '').trim();

  if (!label) return argError(context, 'label', 'string', label);
  if (!value) return argError(context, 'value', 'string', value);

  const menus = context.variables.get('__select_menus__') || {};
  const keys  = Object.keys(menus);
  const key   = menuID && menus[menuID] ? menuID : keys[keys.length - 1];
  if (!key) return '[error: No select menu exists yet!]';

  const opt = { label, value, default: isDefault };
  if (description) opt.description = description;
  if (emoji)       opt.emoji = { name: emoji };
  menus[key].builder.addOptions(opt);

  const components = context.variables.get('__components__') || [];
  const rowID = menus[key].rowID;
  while (components.length <= rowID) { const { ActionRowBuilder: AR } = require('discord.js'); components.push(new AR()); }
  const row = components[rowID];
  row.components = [];
  row.addComponents(menus[key].builder);
  context.variables.set('__components__', components);
  context.variables.set('__select_menus__', menus);
  return '';
};
