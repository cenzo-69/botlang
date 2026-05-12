'use strict';

const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

const STYLES = {
  primary: ButtonStyle.Primary, blurple: ButtonStyle.Primary,
  secondary: ButtonStyle.Secondary, grey: ButtonStyle.Secondary, gray: ButtonStyle.Secondary,
  success: ButtonStyle.Success, green: ButtonStyle.Success,
  danger: ButtonStyle.Danger, red: ButtonStyle.Danger,
  link: ButtonStyle.Link,
};

// $addButtonCV2[buttonID/URL;label;style;disabled?;emoji?;actionRowID?]
// Adds a button using the v2 component system with explicit action row ID.
// Appended to the components array in context.
module.exports = async (context, args) => {
  const idOrURL    = String(args[0] !== undefined ? args[0] : '').trim();
  const label      = String(args[1] !== undefined ? args[1] : '').trim();
  const styleRaw   = String(args[2] !== undefined ? args[2] : 'primary').trim().toLowerCase();
  const disabled   = String(args[3] !== undefined ? args[3] : '').trim().toLowerCase() === 'true';
  const emoji      = String(args[4] !== undefined ? args[4] : '').trim() || undefined;
  const rowID      = parseInt(args[5]) || 0;

  if (!idOrURL) return '[error: $addButtonCV2 requires a button ID or URL]';
  if (!label)   return '[error: $addButtonCV2 requires a label]';

  const style = STYLES[styleRaw] ?? ButtonStyle.Primary;

  const btn = new ButtonBuilder().setLabel(label).setStyle(style).setDisabled(disabled);
  if (emoji) {
    const emojiRe = /^<?(a?):(\w+):(\d+)>?$/;
    const match = emoji.match(emojiRe);
    if (match) { btn.setEmoji({ name: match[2], id: match[3], animated: !!match[1] }); }
    else { btn.setEmoji({ name: emoji }); }
  }

  if (style === ButtonStyle.Link) { btn.setURL(idOrURL); }
  else { btn.setCustomId(idOrURL); }

  const components = context.variables.get('__components__') || [];
  while (components.length <= rowID) components.push(new ActionRowBuilder());
  components[rowID].addComponents(btn);
  context.variables.set('__components__', components);
  return '';
};
