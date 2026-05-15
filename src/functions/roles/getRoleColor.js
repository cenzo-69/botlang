'use strict';

const { argError } = require('../../core/fnError');

// $getRoleColor[roleID]
// Returns the hex color of a role (e.g. "#ff0000"). Returns "#000000" if no color is set.
module.exports = async (context, args) => {
  const roleID = String(args[0] !== undefined ? args[0] : '').trim();
  if (!roleID) return argError(context, 'role ID', 'Role', roleID);
  if (!context.message?.guild) return '[error: Not in a guild!]';

  try {
    const role = await context.message.guild.roles.fetch(roleID);
    if (!role) return '[error: Role not found!]';
    return role.hexColor;
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
