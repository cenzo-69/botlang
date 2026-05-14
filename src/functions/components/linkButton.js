'use strict';

const { argError } = require('../../core/fnError');

const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

// $linkButton[label;url;emoji?;disabled?]
// Adds a link-style button to the message. Clicking it opens the URL in the browser.
// Link buttons do not fire interaction events.
module.exports = async (context, args) => {
  const label    = String(args[0] !== undefined ? args[0] : '').trim();
  const url      = String(args[1] !== undefined ? args[1] : '').trim();
  const emoji    = String(args[2] !== undefined ? args[2] : '').trim();
  const disabled = String(args[3] !== undefined ? args[3] : '').trim().toLowerCase() === 'true';

  if (!label) return argError(context, 'label', 'string', label);
  if (!url)   return argError(context, 'url', 'URL', url);

  try {
    new URL(url); // validate URL format
  } catch {
    return '[error: $linkButton — invalid URL]';
  }

  const btn = new ButtonBuilder()
    .setLabel(label)
    .setStyle(ButtonStyle.Link)
    .setURL(url)
    .setDisabled(disabled);

  if (emoji) {
    try { btn.setEmoji(emoji); } catch { /* ignore bad emoji */ }
  }

  context.components.push({ type: 'button', builder: btn });
  return '';
};
