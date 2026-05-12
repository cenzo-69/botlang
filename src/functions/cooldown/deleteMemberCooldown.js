'use strict';
// $deleteMemberCooldown[guildID?;userID?]  — removes a member's per-guild cooldown
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim() || context.message?.guildId || 'unknown';
  const userID  = String(args[1] !== undefined ? args[1] : '').trim() || context.message?.author?.id || 'unknown';
  context.variables.delete(`__cd_member_${guildID}_${userID}__`);
  return '';
};
