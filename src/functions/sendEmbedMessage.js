'use strict';

const { EmbedBuilder } = require('discord.js');

// $sendEmbedMessage[channelID;content;title;titleURL;description;color;
//                   author;authorIcon;footer;footerIcon;thumbnail;image;
//                   timestamp?;returnMessageID?]
//
// All arguments are optional except channelID.
// Pass "" to skip any field.
// Set returnMessageID to "true" to return the sent message's ID.
module.exports = async (context, args) => {
  if (!context.client) return '[error: no client]';

  const [
    channelID,  content,    title,       titleURL,
    description, color,     author,      authorIcon,
    footer,     footerIcon, thumbnail,   image,
    timestampArg, returnMsgID,
  ] = args;

  if (!channelID) return '[error: $sendEmbedMessage requires a channelID]';

  try {
    const channel = await context.client.channels.fetch(channelID);
    if (!channel) return '[error: channel not found]';

    const embed = new EmbedBuilder();

    if (title && title.trim())           embed.setTitle(title.trim());
    if (titleURL && titleURL.trim())     embed.setURL(titleURL.trim());
    if (description && description.trim()) embed.setDescription(description.trim());
    if (color && color.trim()) {
      const hex = parseInt(color.trim().replace(/^#/, ''), 16);
      if (!isNaN(hex)) embed.setColor(hex);
    }
    if (author && author.trim()) {
      embed.setAuthor({
        name:    author.trim(),
        iconURL: (authorIcon && authorIcon.trim()) ? authorIcon.trim() : undefined,
      });
    }
    if (footer && footer.trim()) {
      embed.setFooter({
        text:    footer.trim(),
        iconURL: (footerIcon && footerIcon.trim()) ? footerIcon.trim() : undefined,
      });
    }
    if (thumbnail && thumbnail.trim()) embed.setThumbnail(thumbnail.trim());
    if (image && image.trim())         embed.setImage(image.trim());
    if (timestampArg && timestampArg.trim()) embed.setTimestamp(Date.now());

    const payload = { embeds: [embed] };
    if (content && content.trim()) payload.content = content.trim();

    const sent = await channel.send(payload);
    return (returnMsgID && returnMsgID.trim() === 'true') ? sent.id : '';
  } catch (err) {
    console.error(`[$sendEmbedMessage] ${err.message}`);
    return `[error: ${err.message}]`;
  }
};
