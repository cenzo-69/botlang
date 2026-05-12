'use strict';
// $getGuildCooldownTime[guildID?;commandDuration?]  — returns remaining ms of guild cooldown
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim() || context.message?.guildId || 'unknown';
  const ms      = parseInt(args[1] !== undefined ? args[1] : 0) || 0;
  const key     = `__cd_guild_${guildID}__`;
  const last    = parseInt(context.variables.get(key) ?? 0) || 0;
  if (!last || !ms) return '0';
  const remaining = ms - (Date.now() - last);
  return String(remaining > 0 ? remaining : 0);
};
