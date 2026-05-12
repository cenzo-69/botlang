'use strict';

const parseTime = require('../../core/parseTime');
const fnError   = require('../../core/fnError');

// $serverCooldown[duration;message?]
// Per-server cooldown — all users in this guild share one cooldown slot.
// Duration: 10s | 5m | 2h | 1d

const cooldowns = new Map(); // key: `guildID:cmdName` → expiry timestamp

module.exports = async (context, args) => {
  const raw     = String(args[0] !== undefined ? args[0] : '').trim();
  const ms      = parseTime(raw);
  const message = args[1] !== undefined ? String(args[1]) : null;

  if (!ms) {
    return fnError('serverCooldown', 'invalid or missing duration', {
      got:      raw || '(empty)',
      expected: 'a duration like `30s`, `5m`, `1h`, `1d`',
      example:  '$serverCooldown[1h]',
    });
  }

  const guildID = context.message?.guild?.id ?? context.interaction?.guildId;
  const cmdName = context.commandName || 'cmd';

  if (!guildID) {
    return fnError('serverCooldown', 'could not determine guild ID', {
      tip: 'This function only works inside a server',
    });
  }

  const key    = `${guildID}:${cmdName}`;
  const now    = Date.now();
  const expiry = cooldowns.get(key) || 0;

  if (now < expiry) {
    const remaining = ((expiry - now) / 1000).toFixed(1);
    const reply = message ?? `⏳ This command is on a server cooldown. Try again in **${remaining}s**.`;
    context._out.stopMessage = reply;
    context.stop();
    return '';
  }

  cooldowns.set(key, now + ms);
  return '';
};

module.exports._store = cooldowns;
