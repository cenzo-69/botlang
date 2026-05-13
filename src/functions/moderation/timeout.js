'use strict';

const fnError   = require('../../core/fnError');
const parseTime = require('../../core/parseTime');

// $timeout[userID;duration;reason?]
// Times out a guild member. Duration: 10s | 5m | 2h | 1d (max 28d).
// Returns '' (action function — no output leak).
module.exports = async (context, args) => {
  const guild = context.message?.guild ?? context.interaction?.guild;
  if (!guild) {
    return fnError('timeout', 'guild context is required', {
      tip: '$timeout only works inside a server command',
    });
  }

  const userID = String(args[0] !== undefined ? args[0] : '').trim();
  if (!userID) {
    return fnError('timeout', 'userID is required', {
      expected: 'a valid Discord user ID',
      example:  '$timeout[$mentioned;1h;Spamming]',
    });
  }

  const raw = String(args[1] !== undefined ? args[1] : '1h').trim();
  const ms  = parseTime(raw);
  if (!ms) {
    return fnError('timeout', 'invalid duration', {
      got:      raw || '(empty)',
      expected: 'a duration string like `10s`, `5m`, `1h`, `1d` (max 28d)',
      example:  '$timeout[123456789;1h;Misbehaving]',
    });
  }

  const MAX_TIMEOUT_MS = 28 * 24 * 60 * 60 * 1000;
  if (ms > MAX_TIMEOUT_MS) {
    return fnError('timeout', 'duration exceeds Discord\'s 28-day maximum', {
      got:      raw,
      expected: 'a duration of 28 days or less',
      example:  '$timeout[123456789;7d;Long term ban alternative]',
    });
  }

  const reason = args[2] !== undefined ? String(args[2]) : 'No reason provided';

  try {
    const member = await guild.members.fetch(userID);
    await member.timeout(ms, reason);
    return '';
  } catch (err) {
    return fnError('timeout', err.message, {
      got: userID,
      tip: 'Check the bot has "Moderate Members" permission and outranks the target',
    });
  }
};
