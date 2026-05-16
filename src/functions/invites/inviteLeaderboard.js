'use strict';

// $inviteLeaderboard[limit?;format?]
// Returns a formatted invite leaderboard for the current guild.
// format: "full" (default) = "#1 @User — 5 invites"
//         "ids"            = "userID:total,userID:total,..."
//         "mentions"       = "#1 <@userID> — 5 invites"
module.exports = async (context, args) => {
  const limit  = parseInt(args[0]) || 10;
  const format = String(args[1] !== undefined ? args[1] : 'full').toLowerCase().trim();

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
    const user = format === 'mentions'
      ? `<@${entry.userID}>`
      : (guild?.members?.cache?.get(entry.userID)?.user?.username ?? entry.userID);

    return `${pos} ${user} — **${entry.total}** invite${entry.total !== 1 ? 's' : ''} (${entry.real} real · ${entry.left} left · ${entry.bonus} bonus)`;
  }).join('\n');
};
