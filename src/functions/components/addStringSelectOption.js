'use strict';

const { argError } = require('../../core/fnError');

const { ActionRowBuilder } = require('discord.js');

// $addStringSelectOption[menuID;value;label;description?;emoji?;default?]
// Adds an option to the named string select menu.
// menuID      — custom ID of the select menu created with $addStringSelect
// value       — the value sent to the handler when this option is selected
// label       — the visible text shown in the dropdown
// description — optional short description shown under the label (max 100 chars)
// emoji       — optional emoji name (e.g. 🏓)
// default     — "true" to pre-select this option (default: false)
module.exports = async (context, args) => {
  const menuID      = String(args[0] !== undefined ? args[0] : '').trim();
  const value       = String(args[1] !== undefined ? args[1] : '').trim();
  const label       = String(args[2] !== undefined ? args[2] : '').trim() || value;
  const description = String(args[3] !== undefined ? args[3] : '').trim();
  const emoji       = String(args[4] !== undefined ? args[4] : '').trim();
  const isDefault   = String(args[5] !== undefined ? args[5] : '').trim().toLowerCase() === 'true';

  if (!value) return argError(context, 'value', 'string', value);
  if (!label) return argError(context, 'label', 'string', label);

  const menus = context.variables.get('__select_menus__') || {};
  const keys  = Object.keys(menus);
  const key   = (menuID && menus[menuID]) ? menuID : keys[keys.length - 1];
  if (!key || !menus[key]) return '[error: No select menu found — call $addStringSelect first!]';

  const opt = { label, value, default: isDefault };
  if (description) opt.description = description.slice(0, 100);
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
