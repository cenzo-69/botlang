'use strict';
const parseTime = require('../../core/parseTime');
// $userCooldown[duration;message?]  — per-user cooldown. duration uses s/h/d format
// Returns empty string if not on cooldown; returns message (or default) if user is on cooldown.
module.exports = async (context, args) => {
  const ms      = parseTime(args[0]);
  const message = args[1] !== undefined ? String(args[1]) : 'You are on cooldown!';
  if (!ms) return '[error: $userCooldown — invalid duration. Usage: $userCooldown[30s] or $userCooldown[5m]]';
  const userID = context.message?.author?.id ?? 'unknown';
  const key    = `__cd_user_${userID}__`;
  const now    = Date.now();
  const last   = parseInt(context.variables.get(key) ?? 0) || 0;
  if (now - last < ms) {
    const remaining = ms - (now - last);
    context.variables.set('__cd_remaining__', String(remaining));
    context.stop();
    return message;
  }
  context.variables.set(key, String(now));
  return '';
};
