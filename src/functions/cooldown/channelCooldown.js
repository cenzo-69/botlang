'use strict';
const parseTime = require('../../core/parseTime');
// $channelCooldown[duration;message?]  — per-channel cooldown
module.exports = async (context, args) => {
  const ms      = parseTime(args[0]);
  const message = args[1] !== undefined ? String(args[1]) : 'This channel is on cooldown!';
  if (!ms) return '[error: $channelCooldown — invalid duration. Usage: $channelCooldown[30s]]';
  const channelID = context.message?.channelId ?? 'unknown';
  const key       = `__cd_channel_${channelID}__`;
  const now       = Date.now();
  const last      = parseInt(context.variables.get(key) ?? 0) || 0;
  if (now - last < ms) {
    context.variables.set('__cd_remaining__', String(ms - (now - last)));
    context.stop();
    return message;
  }
  context.variables.set(key, String(now));
  return '';
};
