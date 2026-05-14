'use strict';

const { argError } = require('../../core/fnError');

// $isMentionable[roleID]
// Returns "true" if the role can be mentioned by regular members.
module.exports = async (context, args) => {
  const roleID = String(args[0] || '').trim();
  if (!roleID) return argError(context, 'role ID', 'Role', roleID);
  const guild = context.message?.guild;
  if (!guild) return '[error: no guild]';
  const role = guild.roles.cache.get(roleID);
  if (!role) return '[error: role not found]';
  return String(role.mentionable);
};
