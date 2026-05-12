'use strict';

const parseTime = require('../../core/parseTime');
const fnError   = require('../../core/fnError');

// $changeCooldownTime[newDuration;type?;id?]
// Updates the remaining cooldown for the current command.
// type: "user" (default) | "global" | "server"
// Pass "0" or "0s" to clear the cooldown immediately.

module.exports = async (context, args) => {
  const raw     = String(args[0] !== undefined ? args[0] : '').trim();
  const ms      = raw === '0' ? 0 : parseTime(raw);
  const type    = String(args[1] !== undefined ? args[1] : 'user').toLowerCase();
  const cmdName = context.commandName || 'cmd';
  const now     = Date.now();

  if (ms === 0 && raw !== '0' && raw !== '0s' && raw !== '0ms') {
    return fnError('changeCooldownTime', 'invalid duration', {
      got:      raw || '(empty)',
      expected: 'a duration like `30s`, `5m`, or `0` to clear',
      example:  '$changeCooldownTime[0]  or  $changeCooldownTime[1m;user]',
    });
  }

  if (type === 'global') {
    const store = require('./globalCooldown')._store;
    if (!store) return '';
    if (ms === 0) store.delete(cmdName);
    else store.set(cmdName, now + ms);
    return '';
  }

  if (type === 'server') {
    const store   = require('./serverCooldown')._store;
    if (!store) return '';
    const guildID = String(args[2] !== undefined ? args[2] : '').trim() || context.message?.guild?.id || context.interaction?.guildId || '';
    const key     = `${guildID}:${cmdName}`;
    if (ms === 0) store.delete(key);
    else store.set(key, now + ms);
    return '';
  }

  // default: per-user
  const store  = require('./cooldown')._store;
  if (!store) return '';
  const userID = String(args[2] !== undefined ? args[2] : '').trim()
               || context.message?.author?.id || context.interaction?.user?.id || '';
  const key    = `${cmdName}:${userID}`;
  if (ms === 0) store.delete(key);
  else store.set(key, now + ms);
  return '';
};
