'use strict';
// $getMemberCooldownTime[guildID?;userID?;commandDuration?]  — remaining ms of member cooldown
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim() || context.message?.guildId || 'unknown';
  const userID  = String(args[1] !== undefined ? args[1] : '').trim() || context.message?.author?.id || 'unknown';
  const ms      = parseInt(args[2] !== undefined ? args[2] : 0) || 0;
  const key     = `__cd_member_${guildID}_${userID}__`;
  const last    = parseInt(context.variables.get(key) ?? 0) || 0;
  if (!last || !ms) return '0';
  const remaining = ms - (Date.now() - last);
  return String(remaining > 0 ? remaining : 0);
};
