'use strict';

const { argError } = require('../../core/fnError');

const { EmbedBuilder } = require('discord.js');

// $editMessage[channelID;messageID;content;title?;description?;color?;footer?]
// Edits a message. Content is the non-embed text. Pass empty string for embed fields to skip them.
// If any embed fields are provided, an embed is rebuilt with those fields.
module.exports = async (context, args) => {
  const channelID = String(args[0] !== undefined ? args[0] : '').trim();
  const messageID = String(args[1] !== undefined ? args[1] : '').trim();
  const content   = String(args[2] !== undefined ? args[2] : '');
  const title     = String(args[3] !== undefined ? args[3] : '').trim();
  const desc      = String(args[4] !== undefined ? args[4] : '').trim();
  const color     = String(args[5] !== undefined ? args[5] : '').trim();
  const footer    = String(args[6] !== undefined ? args[6] : '').trim();

  if (!channelID) return argError(context, 'channel ID', 'TextChannel', channelID);
  if (!messageID) return argError(context, 'message ID', 'Snowflake', messageID);
  if (!context.client) return '[error: No client!]';

  try {
    const channel = await context.client.channels.fetch(channelID);
    const msg     = await channel.messages.fetch(messageID);

    const payload = { content: content || null };

    const hasEmbed = title || desc || color || footer;
    if (hasEmbed) {
      const embed = new EmbedBuilder();
      if (title)  embed.setTitle(title);
      if (desc)   embed.setDescription(desc);
      if (color)  embed.setColor(color);
      if (footer) embed.setFooter({ text: footer });
      payload.embeds = [embed];
    }

    await msg.edit(payload);
    return '';
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
