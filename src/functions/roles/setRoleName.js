'use strict';

const { argError } = require('../../core/fnError');

// $setRoleName[roleID;name;reason?]
// Renames a role.
module.exports = async (context, args) => {
  const roleID = String(args[0] !== undefined ? args[0] : '').trim();
  const name   = String(args[1] !== undefined ? args[1] : '').trim();
  const reason = String(args[2] !== undefined ? args[2] : '').trim() || 'No reason provided';

  if (!roleID) return argError(context, 'role ID', 'Role', roleID);
  if (!name)   return argError(context, 'name', 'string', name);
  if (!context.message?.guild) return '[error: Not in a guild!]';

  try {
    const role = await context.message.guild.roles.fetch(roleID);
    if (!role) return '[error: Role not found!]';
    await role.setName(name, reason);
    return '';
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
