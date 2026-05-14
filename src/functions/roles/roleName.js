'use strict';

const { argError } = require('../../core/fnError');

// $roleName[roleID]
// Returns the name of a role by its ID.
module.exports = async (context, args) => {
  const roleID = String(args[0] !== undefined ? args[0] : '').trim();
  if (!roleID) return argError(context, 'role ID', 'Role', roleID);
  if (!context.message?.guild) return '[error: $roleName — not in a guild]';

  try {
    const role = await context.message.guild.roles.fetch(roleID);
    return role?.name ?? '[error: $roleName — role not found]';
  } catch (err) {
    return `[error: $roleName — ${err.message}]`;
  }
};
