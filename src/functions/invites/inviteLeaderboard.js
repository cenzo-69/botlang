'use strict';

// $inviteLeaderboard[limit?;format?;separator?]
// Returns a formatted invite leaderboard for the current guild.
//
// limit     — max entries to show (default: 10)
// format    — "full" (default), "mentions", "ids", "minimal"
//   full      → #1 Username — 10 invites (8 real · 1 left · 2 bonus · 0 fake)
//   mentions  → #1 <@userID> — 10 invites (8 real · 1 left · 2 bonus · 0 fake)
//   minimal   → #1 Username — 10 invites
//   ids       → userID:total,userID:total,...  (machine-readable)
// separator — string between each row (default: newline)
module.exports = async (context, args) => {
  const limit  = parseInt(args[0]) || 10;
  const format = String(args[1] !== undefined ? args[1] : 'full').trim().toLowerCase();
  const sep    = args[2] !== undefined ? String(args[2]) : '\n';

  const guildID = context.message?.guild?.id ?? context.message?.guildId ?? '';
  if (!guildID) return '[error: Not in a guild!]';

  const tracker = context.client?._cenzoInviteTracker;
  if (!tracker) return '[error: InviteTracker not available!]';

  const board = tracker.getLeaderboard(guildID, limit);
  if (!board.length) return 'No invite data yet.';

  if (format === 'ids') {
    return board.map(e => `${e.userID}:${e.total}`).join(',');
  }

  const guild = context.message?.guild ?? context.client?.guilds?.cache?.get(guildID);

  return board.map((entry, i) => {
    const pos  = `#${i + 1}`;
    const name = format === 'mentions'
      ? `<@${entry.userID}>`
      : (guild?.members?.cache?.get(entry.userID)?.user?.username ?? entry.userID);

    const invWord = entry.total !== 1 ? 'invites' : 'invite';

    if (format === 'minimal') {
      return `${pos} ${name} — **${entry.total}** ${invWord}`;
    }

    return `${pos} ${name} — **${entry.total}** ${invWord} (${entry.real} real · ${entry.left} left · ${entry.bonus} bonus · ${entry.fake} fake)`;
  }).join(sep);
};
