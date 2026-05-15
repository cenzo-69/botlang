'use strict';

const { argError } = require('../../core/fnError');

// $rolePosition[roleID]
// Returns the integer position of a role in the guild hierarchy.
module.exports = async (context, args) => {
  const roleID = String(args[0] !== undefined ? args[0] : '').trim();
  if (!roleID) return argError(context, 'role ID', 'Role', roleID);
  if (!context.message?.guild) return '[error: Not in a guild!]';

  try {
    const role = await context.message.guild.roles.fetch(roleID);
    return role ? String(role.position) : '[error: Role not found!]';
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
