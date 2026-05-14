'use strict';

const { argError } = require('../../core/fnError');

// $isHoisted[roleID]
// Returns "true" if the role is displayed separately in the member list (hoisted).
module.exports = async (context, args) => {
  const roleID = String(args[0] || '').trim();
  if (!roleID) return argError(context, 'role ID', 'Role', roleID);
  const guild = context.message?.guild;
  if (!guild) return '[error: no guild]';
  const role = guild.roles.cache.get(roleID);
  if (!role) return '[error: role not found]';
  return String(role.hoist);
};
