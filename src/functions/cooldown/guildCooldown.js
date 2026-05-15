'use strict';
const parseTime = require('../../core/parseTime');
// $guildCooldown[duration;message?]  — per-guild cooldown. duration uses s/h/d format
module.exports = async (context, args) => {
  const ms      = parseTime(args[0]);
  const message = args[1] !== undefined ? String(args[1]) : 'This server is on cooldown!';
  if (!ms) return '[error: Invalid duration. Usage: $guildCooldown[1h!]]';
  const guildID = context.message?.guildId ?? 'unknown';
  const key     = `__cd_guild_${guildID}__`;
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
