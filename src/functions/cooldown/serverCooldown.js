'use strict';

// $serverCooldown[duration]
// Per-server, per-command cooldown — all users in this guild share one cooldown slot.
// Duration format: 10s | 5m | 2h | 1d

const cooldowns = new Map(); // key: `guildID:cmdName` → expiry timestamp

function parseMs(str) {
  const m = String(str).match(/^(\d+)(ms|s|m|h|d)?$/i);
  if (!m) return 0;
  const n     = parseInt(m[1]);
  const units = { ms: 1, s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return n * (units[(m[2] || 's').toLowerCase()] ?? 1000);
}

module.exports = async (context, args) => {
  const ms      = parseMs(args[0] || '0');
  if (!ms) return '';

  const guildID = context.message?.guild?.id;
  const cmdName = context.commandName || 'cmd';
  if (!guildID) return '';

  const key    = `${guildID}:${cmdName}`;
  const now    = Date.now();
  const expiry = cooldowns.get(key) || 0;

  if (now < expiry) {
    const remaining = ((expiry - now) / 1000).toFixed(1);
    context._out.stopMessage = `⏳ This command is on a server cooldown. Try again in ${remaining}s.`;
    context.stop();
    return '';
  }

  cooldowns.set(key, now + ms);
  return '';
};

module.exports._store = cooldowns;
