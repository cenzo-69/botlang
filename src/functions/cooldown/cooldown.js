'use strict';

// $cooldown[duration]
//
// Per-user, per-command cooldown.
// If the calling user is on cooldown, stops execution and returns a message.
//
// Duration format: 10s | 5m | 2h | 1d  (default unit: seconds)
//
// Cooldown state is in-memory — resets when the bot restarts.
//
// Example:
//   $cooldown[30s]
//   You used this command! It's on a 30-second cooldown per user.

const cooldowns = new Map(); // key: `${cmdName}:${userID}` → expiry timestamp

function parseMs(str) {
  const m = String(str).match(/^(\d+)(ms|s|m|h|d)?$/i);
  if (!m) return 0;
  const n = parseInt(m[1]);
  const units = { ms: 1, s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return n * (units[(m[2] || 's').toLowerCase()] ?? 1000);
}

module.exports = async (context, args) => {
  const ms = parseMs(args[0] || '0');
  if (!ms) return '';

  const userID  = context.message?.author?.id;
  const cmdName = context.commandName || 'cmd';
  const key     = `${cmdName}:${userID}`;
  const now     = Date.now();
  const expiry  = cooldowns.get(key) || 0;

  if (now < expiry) {
    const remaining = ((expiry - now) / 1000).toFixed(1);
    context._out.stopMessage = `⏳ You're on cooldown. Try again in ${remaining}s.`;
    context.stop();
    return '';
  }

  cooldowns.set(key, now + ms);
  return '';
};

module.exports._store = cooldowns;
