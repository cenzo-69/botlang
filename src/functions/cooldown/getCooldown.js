'use strict';

const fnError = require('../../core/fnError');

// $getCooldown[type?;id?]
// Returns remaining cooldown seconds for the current command.
// type: "user" (default) | "global" | "server"
// Returns "0" if no active cooldown.

module.exports = async (context, args) => {
  const type    = String(args[0] !== undefined ? args[0] : 'user').toLowerCase();
  const cmdName = context.commandName || 'cmd';
  const now     = Date.now();

  if (!['user', 'global', 'server'].includes(type)) {
    return fnError('getCooldown', 'invalid cooldown type', {
      got:      type,
      expected: '`user`, `global`, or `server`',
      example:  '$getCooldown[user]',
    });
  }

  if (type === 'global') {
    const store  = require('./globalCooldown')._store;
    if (!store) return '0';
    const expiry = store.get(cmdName) || 0;
    return String(Math.max(0, (expiry - now) / 1000).toFixed(1));
  }

  if (type === 'server') {
    const store   = require('./serverCooldown')._store;
    if (!store) return '0';
    const guildID = String(args[1] !== undefined ? args[1] : '').trim() || context.message?.guild?.id || context.interaction?.guildId || '';
    const expiry  = store.get(`${guildID}:${cmdName}`) || 0;
    return String(Math.max(0, (expiry - now) / 1000).toFixed(1));
  }

  // default: per-user
  const store  = require('./cooldown')._store;
  if (!store) return '0';
  const userID = String(args[1] !== undefined ? args[1] : '').trim()
               || context.message?.author?.id || context.interaction?.user?.id || '';
  const expiry = store.get(`${cmdName}:${userID}`) || 0;
  return String(Math.max(0, (expiry - now) / 1000).toFixed(1));
};
