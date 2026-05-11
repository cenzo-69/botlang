'use strict';

const db = require('../../core/db');
const { EmbedBuilder } = require('discord.js');

// $giveawayEnd[messageID;channelID?]
// Ends a giveaway: fetches 🎉 reactions, picks random winners, announces them.
// Returns a comma-separated list of winner mentions.
module.exports = async (context, args) => {
  const messageID = String(args[0] !== undefined ? args[0] : '').trim();
  const channelID = String(args[1] !== undefined ? args[1] : '').trim();

  if (!messageID)  return '[error: $giveawayEnd requires a messageID]';
  if (!context.client) return '[error: $giveawayEnd — no client]';

  const raw = db.get(`__giveaway_${messageID}`, null);
  if (!raw) return '[error: $giveawayEnd — giveaway not found]';

  let data;
  try { data = JSON.parse(raw); } catch { return '[error: $giveawayEnd — corrupt giveaway data]'; }
  if (!data.active) return '[error: $giveawayEnd — giveaway already ended]';

  try {
    const chID    = channelID || data.channelID;
    const channel = await context.client.channels.fetch(chID);
    const msg     = await channel.messages.fetch(messageID);

    // Collect 🎉 reactors (exclude bots)
    const reaction  = msg.reactions.cache.get('🎉');
    let entrantIDs  = [];
    if (reaction) {
      const users = await reaction.users.fetch();
      entrantIDs  = [...users.values()]
        .filter(u => !u.bot)
        .map(u => u.id);
    }

    if (!entrantIDs.length) {
      await channel.send({ content: `😔 No valid entries for **${data.prize}**. No winners!` });
      data.active  = false;
      data.winners = [];
      db.set(`__giveaway_${messageID}`, JSON.stringify(data));
      return 'No winners';
    }

    // Pick winners (no duplicates)
    const shuffled = entrantIDs.sort(() => Math.random() - 0.5);
    const winners  = shuffled.slice(0, Math.min(data.winnerCount, shuffled.length));

    const mentions = winners.map(id => `<@${id}>`).join(', ');

    const embed = new EmbedBuilder()
      .setTitle('🎉 Giveaway Ended!')
      .setDescription(
        `**Prize:** ${data.prize}\n` +
        `**Winner${winners.length !== 1 ? 's' : ''}:** ${mentions}`
      )
      .setColor(0x57F287)
      .setTimestamp();

    await channel.send({ embeds: [embed], content: `Congratulations ${mentions}! 🎉` });

    // Update original message embed
    const endedEmbed = EmbedBuilder.from(msg.embeds[0] || new EmbedBuilder())
      .setColor(0x5865F2)
      .setFooter({ text: `Ended • Winner${winners.length !== 1 ? 's' : ''}: ${winners.length}` })
      .setDescription(
        `**Prize:** ${data.prize}\n` +
        `**Winner${winners.length !== 1 ? 's' : ''}:** ${mentions}\n\n` +
        `*This giveaway has ended.*`
      );
    await msg.edit({ embeds: [endedEmbed] });

    data.active  = false;
    data.winners = winners;
    db.set(`__giveaway_${messageID}`, JSON.stringify(data));

    return mentions;
  } catch (err) {
    return `[error: $giveawayEnd — ${err.message}]`;
  }
};
