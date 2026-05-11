'use strict';

const db = require('../../core/db');

// $giveawayReroll[messageID;channelID?;winnerCount?]
// Re-picks random winners from the original giveaway reactions.
// Excludes the previous winners. Returns new winner mentions.
module.exports = async (context, args) => {
  const messageID   = String(args[0] !== undefined ? args[0] : '').trim();
  const channelID   = String(args[1] !== undefined ? args[1] : '').trim();
  const winnerCount = parseInt(args[2]) || null;

  if (!messageID)  return '[error: $giveawayReroll requires a messageID]';
  if (!context.client) return '[error: $giveawayReroll — no client]';

  const raw = db.get(`__giveaway_${messageID}`, null);
  if (!raw) return '[error: $giveawayReroll — giveaway not found]';

  let data;
  try { data = JSON.parse(raw); } catch { return '[error: $giveawayReroll — corrupt data]'; }

  try {
    const chID    = channelID || data.channelID;
    const channel = await context.client.channels.fetch(chID);
    const msg     = await channel.messages.fetch(messageID);

    const reaction = msg.reactions.cache.get('🎉');
    let entrantIDs = [];
    if (reaction) {
      const users = await reaction.users.fetch();
      entrantIDs = [...users.values()]
        .filter(u => !u.bot && !data.winners.includes(u.id))
        .map(u => u.id);
    }

    if (!entrantIDs.length) {
      await channel.send({ content: `😔 No eligible entries to reroll from.` });
      return 'No eligible entries';
    }

    const count    = winnerCount ?? data.winnerCount;
    const shuffled = entrantIDs.sort(() => Math.random() - 0.5);
    const winners  = shuffled.slice(0, Math.min(count, shuffled.length));
    const mentions = winners.map(id => `<@${id}>`).join(', ');

    await channel.send({
      content: `🔁 **Giveaway Reroll** for **${data.prize}**!\nNew winner${winners.length !== 1 ? 's' : ''}: ${mentions} 🎉`,
    });

    data.winners = [...new Set([...data.winners, ...winners])];
    db.set(`__giveaway_${messageID}`, JSON.stringify(data));

    return mentions;
  } catch (err) {
    return `[error: $giveawayReroll — ${err.message}]`;
  }
};
