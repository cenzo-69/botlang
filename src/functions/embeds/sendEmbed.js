'use strict';

// $sendEmbed[channelID]
//
// Sends the currently built embed (via $title, $description, $color, etc.)
// to the specified channel. Returns the sent message ID.
//
// Use alongside the inline embed builder functions:
//   $title[My Title]
//   $description[Hello world]
//   $color[#ff0000]
//   $sendEmbed[123456789]
module.exports = async (context, args) => {
  if (!context.client) return '[error: no client]';

  const channelID = args[0];
  if (!channelID) return '[error: $sendEmbed requires a channelID]';

  const { EmbedBuilder } = require('discord.js');
  const e = context.embed;

  const hasContent =
    e.title || e.description || e.color ||
    e.footer.text || e.author.name ||
    e.thumbnail || e.image ||
    e.timestamp !== null || e.fields.length > 0;

  if (!hasContent) return '[error: no embed content set]';

  try {
    const channel = await context.client.channels.fetch(channelID);
    if (!channel) return '[error: channel not found]';

    const embed = new EmbedBuilder();

    if (e.title) {
      embed.setTitle(e.title);
      if (e.url) embed.setURL(e.url);
    }
    if (e.description) embed.setDescription(e.description);
    if (e.color) {
      const hex = parseInt(String(e.color).replace(/^#/, ''), 16);
      if (!isNaN(hex)) embed.setColor(hex);
    }
    if (e.author.name) {
      embed.setAuthor({
        name:    e.author.name,
        iconURL: e.author.iconURL || undefined,
        url:     e.author.url    || undefined,
      });
    }
    if (e.footer.text) {
      embed.setFooter({
        text:    e.footer.text,
        iconURL: e.footer.iconURL || undefined,
      });
    }
    if (e.thumbnail)       embed.setThumbnail(e.thumbnail);
    if (e.image)           embed.setImage(e.image);
    if (e.timestamp !== null) embed.setTimestamp(e.timestamp);
    for (const f of e.fields) {
      embed.addFields({ name: f.name, value: f.value, inline: !!f.inline });
    }

    const sent = await channel.send({ embeds: [embed] });
    return sent.id;
  } catch (err) {
    console.error(`[$sendEmbed] ${err.message}`);
    return `[error: ${err.message}]`;
  }
};
