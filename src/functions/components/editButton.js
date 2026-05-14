'use strict';

const { argError } = require('../../core/fnError');

const { EmbedBuilder } = require('discord.js');

// $editButton[buttonID/URL;label;style;disabled?;emoji?;messageID?]
// Edits an existing button on a message by its custom ID or URL.
// Requires the message to be fetched from the current channel.
module.exports = async (context, args) => {
  const idOrURL  = String(args[0] !== undefined ? args[0] : '').trim();
  const label    = String(args[1] !== undefined ? args[1] : '').trim();
  const styleRaw = String(args[2] !== undefined ? args[2] : '').trim().toLowerCase();
  const disabled = String(args[3] !== undefined ? args[3] : '').trim().toLowerCase() === 'true';
  const emoji    = String(args[4] !== undefined ? args[4] : '').trim() || undefined;
  const messageID= String(args[5] !== undefined ? args[5] : '').trim();

  if (!idOrURL) return argError(context, 'id or u r l', 'URL', idOrURL);
  if (!context.client) return '[error: $editButton — no client]';

  const { ButtonStyle } = require('discord.js');
  const STYLES = {
    primary: ButtonStyle.Primary, secondary: ButtonStyle.Secondary,
    success: ButtonStyle.Success, danger: ButtonStyle.Danger, link: ButtonStyle.Link,
  };
  const style = STYLES[styleRaw] ?? ButtonStyle.Primary;

  try {
    const msg = messageID
      ? await context.message.channel.messages.fetch(messageID)
      : context.message;
    if (!msg) return '[error: $editButton — message not found]';

    const newComponents = msg.components.map(row => {
      const updated = row.components.map(comp => {
        if (comp.customId === idOrURL || comp.url === idOrURL) {
          const { ButtonBuilder } = require('discord.js');
          const btn = ButtonBuilder.from(comp).setLabel(label || comp.label).setStyle(style).setDisabled(disabled);
          if (emoji) btn.setEmoji({ name: emoji });
          return btn;
        }
        return comp;
      });
      const { ActionRowBuilder } = require('discord.js');
      return new ActionRowBuilder().addComponents(updated);
    });

    await msg.edit({ components: newComponents });
    return '';
  } catch (err) {
    return `[error: $editButton — ${err.message}]`;
  }
};
