'use strict';

const db = require('../../core/db');
const { PermissionFlagsBits, ChannelType } = require('discord.js');

// $newTicket[categoryName/ID;noQuestionMessage;inTicketMessage;messageToUser;errorMessage;ticketNumber?;returnID?]
// Creates a support ticket channel under the specified category.
// Stores ticket metadata in db under __ticket_<channelID>.
// Returns the ticket channel ID if returnID is "true", otherwise empty string.
module.exports = async (context, args) => {
  const categoryRef      = String(args[0] !== undefined ? args[0] : '').trim();
  const noQuestionMsg    = String(args[1] !== undefined ? args[1] : '').trim();
  const inTicketMsg      = String(args[2] !== undefined ? args[2] : '').trim();
  const msgToUser        = String(args[3] !== undefined ? args[3] : '').trim();
  const errorMsg         = String(args[4] !== undefined ? args[4] : '').trim();
  const ticketNumber     = String(args[5] !== undefined ? args[5] : '').trim();
  const returnID         = String(args[6] !== undefined ? args[6] : '').trim().toLowerCase() === 'true';

  if (!context.message?.guild) return errorMsg || '[error: $newTicket — not in a guild]';

  const guild  = context.message.guild;
  const author = context.message.author;

  try {
    let categoryChannel = null;
    const snowflakeRe = /^\d{15,20}$/;
    if (snowflakeRe.test(categoryRef)) {
      try { categoryChannel = await context.client.channels.fetch(categoryRef); } catch { /* fall through */ }
    }
    if (!categoryChannel) {
      const cats = guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory);
      categoryChannel = cats.find(c => c.name.toLowerCase() === categoryRef.toLowerCase()) ?? null;
    }
    if (!categoryChannel) return errorMsg || '[error: $newTicket — category not found]';

    const num  = ticketNumber || String(Math.floor(Math.random() * 9000) + 1000);
    const name = `ticket-${num}`;

    const channel = await guild.channels.create({
      name,
      type: ChannelType.GuildText,
      parent: categoryChannel.id,
      permissionOverwrites: [
        { id: guild.id,         deny: [PermissionFlagsBits.ViewChannel] },
        { id: author.id,        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
        { id: context.client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels] },
      ],
    });

    db.set(`__ticket_${channel.id}`, JSON.stringify({
      userID:    author.id,
      guildID:   guild.id,
      number:    num,
      createdAt: Date.now(),
    }));

    if (inTicketMsg) await channel.send({ content: inTicketMsg.replace('{user}', `<@${author.id}>`) });
    if (msgToUser)   await author.send({ content: msgToUser }).catch(() => {});

    return returnID ? channel.id : '';
  } catch (err) {
    return errorMsg || `[error: $newTicket — ${err.message}]`;
  }
};
