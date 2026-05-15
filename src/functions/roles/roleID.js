'use strict';

const { argError } = require('../../core/fnError');

// $roleID[roleName]
// Returns the ID of the first role whose name matches (case-insensitive).
module.exports = async (context, args) => {
  const roleName = String(args[0] !== undefined ? args[0] : '').trim().toLowerCase();
  if (!roleName) return argError(context, 'role name', 'Role', roleName);
  if (!context.message?.guild) return '[error: Not in a guild!]';

  const roles = await context.message.guild.roles.fetch();
  const role  = [...roles.values()].find(r => r.name.toLowerCase() === roleName);
  return role?.id ?? '[error: Role not found!]';
};
