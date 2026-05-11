'use strict';

// $globalCooldown[duration]
//
// Server-wide cooldown — applies to ALL users for this command.
// If ANY user triggered this command recently, everyone is blocked until
// the cooldown expires.
//
// Duration format: 10s | 5m | 2h | 1d  (default unit: seconds)
//
// Example:
//   $globalCooldown[5m]
//   This command was just used. Try again in a few minutes!

const globalCooldowns = new Map(); // key: cmdName → expiry timestamp

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

  const cmdName = context.commandName || 'cmd';
  const now     = Date.now();
  const expiry  = globalCooldowns.get(cmdName) || 0;

  if (now < expiry) {
    const remaining = ((expiry - now) / 1000).toFixed(1);
    context._out.stopMessage = `⏳ This command is on a global cooldown. Try again in ${remaining}s.`;
    context.stop();
    return '';
  }

  globalCooldowns.set(cmdName, now + ms);
  return '';
};
