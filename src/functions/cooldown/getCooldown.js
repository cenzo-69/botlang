'use strict';

// $getCooldown[type?;id?]
// Returns remaining cooldown seconds for the current command.
// type: "user" (default) | "global" | "server"
// id: override userID / guildID (optional)
// Returns "0" if no active cooldown.

module.exports = async (context, args) => {
  const type    = (args[0] || 'user').toLowerCase();
  const cmdName = context.commandName || 'cmd';
  const now     = Date.now();

  if (type === 'global') {
    // Read from globalCooldown module's store
    let store;
    try { store = require('../globalCooldown')._store; } catch { return '0'; }
    if (!store) return '0';
    const expiry = store.get(cmdName) || 0;
    const rem    = Math.max(0, expiry - now);
    return String((rem / 1000).toFixed(1));
  }

  if (type === 'server') {
    let store;
    try { store = require('./serverCooldown')._store; } catch { return '0'; }
    if (!store) return '0';
    const guildID = args[1] || context.message?.guild?.id || '';
    const expiry  = store.get(`${guildID}:${cmdName}`) || 0;
    const rem     = Math.max(0, expiry - now);
    return String((rem / 1000).toFixed(1));
  }

  // default: per-user
  let store;
  try { store = require('../cooldown')._store; } catch { return '0'; }
  if (!store) return '0';
  const userID = args[1] || context.message?.author?.id || '';
  const expiry = store.get(`${cmdName}:${userID}`) || 0;
  const rem    = Math.max(0, expiry - now);
  return String((rem / 1000).toFixed(1));
};
