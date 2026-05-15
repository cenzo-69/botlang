'use strict';

const { argError } = require('../../core/fnError');

// $setRoleMentionable[roleID;true/false;reason?]
// Sets whether a role can be mentioned by regular users.
module.exports = async (context, args) => {
  const roleID       = String(args[0] !== undefined ? args[0] : '').trim();
  const mentionable  = String(args[1] !== undefined ? args[1] : '').trim().toLowerCase() === 'true';
  const reason       = String(args[2] !== undefined ? args[2] : '').trim() || 'No reason provided';

  if (!roleID) return argError(context, 'role ID', 'Role', roleID);
  if (!context.message?.guild) return '[error: Not in a guild!]';

  try {
    const role = await context.message.guild.roles.fetch(roleID);
    if (!role) return '[error: Role not found!]';
    await role.setMentionable(mentionable, reason);
    return '';
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
