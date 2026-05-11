'use strict';

// $setRoleName[roleID;name;reason?]
// Renames a role.
module.exports = async (context, args) => {
  const roleID = String(args[0] !== undefined ? args[0] : '').trim();
  const name   = String(args[1] !== undefined ? args[1] : '').trim();
  const reason = String(args[2] !== undefined ? args[2] : '').trim() || 'No reason provided';

  if (!roleID) return '[error: $setRoleName requires a roleID]';
  if (!name)   return '[error: $setRoleName requires a name]';
  if (!context.message?.guild) return '[error: $setRoleName — not in a guild]';

  try {
    const role = await context.message.guild.roles.fetch(roleID);
    if (!role) return '[error: $setRoleName — role not found]';
    await role.setName(name, reason);
    return '';
  } catch (err) {
    return `[error: $setRoleName — ${err.message}]`;
  }
};
