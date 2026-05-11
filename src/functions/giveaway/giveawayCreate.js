'use strict';

const db = require('../../core/db');
const { EmbedBuilder } = require('discord.js');

// $giveawayCreate[prize;durationMs;winnerCount;channelID?]
// Creates a giveaway in the specified channel. Members react with 🎉 to enter.
// Returns the giveaway message ID (use it with $giveawayEnd, $giveawayReroll, etc.)
module.exports = async (context, args) => {
  const prize       = String(args[0] !== undefined ? args[0] : '').trim();
  const durationMs  = parseInt(args[1]) || 0;
  const winnerCount = parseInt(args[2]) || 1;
  const channelID   = String(args[3] !== undefined ? args[3] : '').trim();

  if (!prize)            return '[error: $giveawayCreate requires a prize]';
  if (durationMs < 1000) return '[error: $giveawayCreate requires a duration >= 1000ms]';
  if (!context.client)   return '[error: $giveawayCreate — no client]';

  try {
    const channel = channelID
      ? await context.client.channels.fetch(channelID)
      : context.message?.channel;

    if (!channel) return '[error: $giveawayCreate — channel not found]';

    const endsAt = Date.now() + durationMs;
    const endsAtStr = `<t:${Math.floor(endsAt / 1000)}:R>`;

    const embed = new EmbedBuilder()
      .setTitle('🎉 GIVEAWAY 🎉')
      .setDescription(
        `**Prize:** ${prize}\n` +
        `**Winners:** ${winnerCount}\n` +
        `**Ends:** ${endsAtStr}\n\n` +
        `React with 🎉 to enter!`
      )
      .setColor(0xFFD700)
      .setFooter({ text: `${winnerCount} winner${winnerCount !== 1 ? 's' : ''} • Ends` })
      .setTimestamp(endsAt);

    const msg = await channel.send({ embeds: [embed] });
    await msg.react('🎉');

    db.set(`__giveaway_${msg.id}`, JSON.stringify({
      prize,
      durationMs,
      winnerCount,
      channelID: channel.id,
      guildID:   channel.guild?.id ?? null,
      createdAt: Date.now(),
      endsAt,
      active:    true,
      winners:   [],
    }));

    return msg.id;
  } catch (err) {
    return `[error: $giveawayCreate — ${err.message}]`;
  }
};
