'use strict';
// $getUserCooldownTime[userID?;commandDuration?]  — returns remaining ms of user cooldown (0 if not on CD)
// Note: this is a read-only check — does NOT set/start a cooldown
module.exports = async (context, args) => {
  const userID = String(args[0] !== undefined ? args[0] : '').trim() || context.message?.author?.id || 'unknown';
  const ms     = parseInt(args[1] !== undefined ? args[1] : 0) || 0;
  const key    = `__cd_user_${userID}__`;
  const last   = parseInt(context.variables.get(key) ?? 0) || 0;
  if (!last || !ms) return '0';
  const remaining = ms - (Date.now() - last);
  return String(remaining > 0 ? remaining : 0);
};
