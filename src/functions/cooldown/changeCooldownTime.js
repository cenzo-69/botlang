'use strict';

// $changeCooldownTime[newDuration;type?;id?]
// Change the remaining cooldown time for the current command.
// type: "user" (default) | "global" | "server"
// newDuration: same format as $cooldown (10s, 5m, etc.) — sets from now.
// Pass "0" to clear the cooldown.

function parseMs(str) {
  const m = String(str).match(/^(\d+)(ms|s|m|h|d)?$/i);
  if (!m) return 0;
  const n     = parseInt(m[1]);
  const units = { ms: 1, s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return n * (units[(m[2] || 's').toLowerCase()] ?? 1000);
}

module.exports = async (context, args) => {
  const ms      = parseMs(args[0] || '0');
  const type    = (args[1] || 'user').toLowerCase();
  const cmdName = context.commandName || 'cmd';
  const now     = Date.now();

  if (type === 'global') {
    let store;
    try { store = require('./globalCooldown')._store; } catch { return ''; }
    if (!store) return '';
    if (ms === 0) store.delete(cmdName);
    else store.set(cmdName, now + ms);
    return '';
  }

  if (type === 'server') {
    let store;
    try { store = require('./serverCooldown')._store; } catch { return ''; }
    if (!store) return '';
    const guildID = args[2] || context.message?.guild?.id || '';
    const key     = `${guildID}:${cmdName}`;
    if (ms === 0) store.delete(key);
    else store.set(key, now + ms);
    return '';
  }

  // default: per-user
  let store;
  try { store = require('./cooldown')._store; } catch { return ''; }
  if (!store) return '';
  const userID = args[2] || context.message?.author?.id || '';
  const key    = `${cmdName}:${userID}`;
  if (ms === 0) store.delete(key);
  else store.set(key, now + ms);
  return '';
};
