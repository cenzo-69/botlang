'use strict';

// $timeout[userID;duration;reason?]
// Times out a guild member.
//
// Duration format: 10s | 5m | 2h | 1d
// Maximum: 28 days (Discord API limit).
//
// Returns empty string on success.

function parseDuration(str) {
  const m = String(str).match(/^(\d+)(ms|s|m|h|d)?$/i);
  if (!m) return 0;
  const n     = parseInt(m[1]);
  const units = { ms: 1, s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return n * (units[(m[2] || 's').toLowerCase()] ?? 1000);
}

module.exports = async (context, args) => {
  const guild  = context.message?.guild;
  if (!guild) return '[error: no guild]';
  const userID = String(args[0] || '').trim();
  if (!userID) return '[error: $timeout requires a userID]';
  const ms     = parseDuration(args[1] || '60s');
  const reason = args[2] ? String(args[2]) : undefined;
  if (!ms) return '[error: invalid duration — use 10s, 5m, 2h, 1d]';
  try {
    const member = await guild.members.fetch(userID);
    await member.timeout(ms, reason);
    return '';
  } catch (err) {
    return `[error: ${err.message}]`;
  }
};
