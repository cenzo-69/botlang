'use strict';

const { argError } = require('../../core/fnError');

// $deleteRole[roleID]
// Deletes a role from the guild. Returns empty string on success.
module.exports = async (context, args) => {
  const guild  = context.message?.guild;
  if (!guild) return '[error: no guild]';
  const roleID = String(args[0] || '').trim();
  if (!roleID) return argError(context, 'role ID', 'Role', roleID);
  try {
    const role = await guild.roles.fetch(roleID);
    if (!role) return '[error: role not found]';
    await role.delete();
    return '';
  } catch (err) {
    return `[error: ${err.message}]`;
  }
};
