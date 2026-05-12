'use strict';
// $deleteGuildCooldown[guildID?]  — removes a guild's cooldown
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim() || context.message?.guildId || 'unknown';
  context.variables.delete(`__cd_guild_${guildID}__`);
  return '';
};
