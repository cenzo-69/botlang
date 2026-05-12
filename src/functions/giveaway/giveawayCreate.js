'use strict';

const db = require('../../core/db');
const parseTime = require('../../core/parseTime');
const { EmbedBuilder } = require('discord.js');

// $giveawayCreate[prize;duration;winnerCount;channelID?]
// Duration uses s/h/d format: 1h | 30m | 1d | 86400s
// Creates a giveaway. Members react with 🎉 to enter.
// Returns the giveaway message ID.
module.exports = async (context, args) => {
  const prize       = String(args[0] !== undefined ? args[0] : '').trim();
  const durationMs  = parseTime(args[1]);
  const winnerCount = parseInt(args[2]) || 1;
  const channelID   = String(args[3] !== undefined ? args[3] : '').trim();

  if (!prize)          return '[error: $giveawayCreate — prize is required. Usage: $giveawayCreate[prize;duration;winners;channelID?]]';
  if (durationMs < 1000) return '[error: $giveawayCreate — duration too short. Minimum: 1s. Examples: 1h, 30m, 1d]';
  if (!context.client) return '[error: $giveawayCreate — no Discord client available]';

  try {
    const channel = channelID
      ? await context.client.channels.fetch(channelID)
      : context.message?.channel;

    if (!channel) return `[error: $giveawayCreate — channel not found: "${channelID || 'current'}"]`;

    const endsAt    = Date.now() + durationMs;
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
