'use strict';
const parseTime = require('../../core/parseTime');
// $memberCooldown[duration;message?]  — per-user per-guild cooldown
module.exports = async (context, args) => {
  const ms      = parseTime(args[0]);
  const message = args[1] !== undefined ? String(args[1]) : 'You are on cooldown in this server!';
  if (!ms) return '[error: Invalid duration. Usage: $memberCooldown[30s!]]';
  const userID  = context.message?.author?.id ?? 'unknown';
  const guildID = context.message?.guildId ?? 'unknown';
  const key     = `__cd_member_${guildID}_${userID}__`;
  const now     = Date.now();
  const last    = parseInt(context.variables.get(key) ?? 0) || 0;
  if (now - last < ms) {
    context.variables.set('__cd_remaining__', String(ms - (now - last)));
    context.stop();
    return message;
  }
  context.variables.set(key, String(now));
  return '';
};
