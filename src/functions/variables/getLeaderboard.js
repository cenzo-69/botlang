'use strict';

const db = require('../../core/db');

// $getLeaderboard[limit?;guildID?;format?]
// Returns top N users by points, sorted descending.
// format: "mention" (default) | "id"
// Output: "1. <@userID> — 500\n2. <@userID2> — 300\n..."
module.exports = async (context, args) => {
  const limit   = parseInt(args[0] ?? '10');
  const guildID = String(args[1] ?? context.message?.guild?.id ?? 'global').trim();
  const format  = String(args[2] ?? 'mention').toLowerCase();

  const prefix  = `points:${guildID}:`;
  const all     = db.all();

  const entries = Object.entries(all)
    .filter(([k]) => k.startsWith(prefix))
    .map(([k, v]) => ({ userID: k.slice(prefix.length), points: parseFloat(v) || 0 }))
    .sort((a, b) => b.points - a.points)
    .slice(0, isNaN(limit) ? 10 : limit);

  if (!entries.length) return 'No points data yet.';

  return entries
    .map((e, i) => {
      const user = format === 'mention' ? `<@${e.userID}>` : e.userID;
      return `${i + 1}. ${user} — ${e.points}`;
    })
    .join('\n');
};
