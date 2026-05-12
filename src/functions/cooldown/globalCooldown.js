'use strict';

const parseTime = require('../../core/parseTime');
const fnError   = require('../../core/fnError');

// $globalCooldown[duration;message?]
// Bot-wide cooldown for a command. Blocks ALL users until it expires.
// Duration: 10s | 5m | 2h | 1d

const globalCooldowns = new Map(); // key: cmdName → expiry timestamp

module.exports = async (context, args) => {
  const raw     = String(args[0] !== undefined ? args[0] : '').trim();
  const ms      = parseTime(raw);
  const message = args[1] !== undefined ? String(args[1]) : null;

  if (!ms) {
    return fnError('globalCooldown', 'invalid or missing duration', {
      got:      raw || '(empty)',
      expected: 'a duration like `30s`, `5m`, `1h`, `1d`',
      example:  '$globalCooldown[5m]',
    });
  }

  const cmdName = context.commandName || 'cmd';
  const now     = Date.now();
  const expiry  = globalCooldowns.get(cmdName) || 0;

  if (now < expiry) {
    const remaining = ((expiry - now) / 1000).toFixed(1);
    const reply = message ?? `⏳ This command is on a global cooldown. Try again in **${remaining}s**.`;
    context._out.stopMessage = reply;
    context.stop();
    return '';
  }

  globalCooldowns.set(cmdName, now + ms);
  return '';
};

module.exports._store = globalCooldowns;
