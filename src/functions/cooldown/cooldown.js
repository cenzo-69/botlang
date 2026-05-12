'use strict';

const parseTime = require('../../core/parseTime');
const fnError   = require('../../core/fnError');

// $cooldown[duration;message?]
// Per-user, per-command cooldown. Stops execution if user is on cooldown.
// Duration: 10s | 5m | 2h | 1d

const cooldowns = new Map(); // key: `cmdName:userID` → expiry timestamp

module.exports = async (context, args) => {
  const raw     = String(args[0] !== undefined ? args[0] : '').trim();
  const ms      = parseTime(raw);
  const message = args[1] !== undefined ? String(args[1]) : null;

  if (!ms) {
    return fnError('cooldown', 'invalid or missing duration', {
      got:      raw || '(empty)',
      expected: 'a duration like `30s`, `5m`, `1h`, `1d`',
      example:  '$cooldown[30s]  or  $cooldown[1m;Slow down!]',
    });
  }

  const userID  = context.message?.author?.id ?? context.interaction?.user?.id ?? 'unknown';
  const cmdName = context.commandName || 'cmd';
  const key     = `${cmdName}:${userID}`;
  const now     = Date.now();
  const expiry  = cooldowns.get(key) || 0;

  if (now < expiry) {
    const remaining = ((expiry - now) / 1000).toFixed(1);
    const reply = message ?? `⏳ You're on cooldown. Try again in **${remaining}s**.`;
    context._out.stopMessage = reply;
    context.stop();
    return '';
  }

  cooldowns.set(key, now + ms);
  return '';
};

module.exports._store = cooldowns;
