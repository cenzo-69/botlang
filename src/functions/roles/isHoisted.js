'use strict';

// $isHoisted[roleID]
// Returns "true" if the role is displayed separately in the member list (hoisted).
module.exports = async (context, args) => {
  const roleID = String(args[0] || '').trim();
  if (!roleID) return '[error: $isHoisted requires a roleID]';
  const guild = context.message?.guild;
  if (!guild) return '[error: no guild]';
  const role = guild.roles.cache.get(roleID);
  if (!role) return '[error: role not found]';
  return String(role.hoist);
};
