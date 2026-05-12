'use strict';

// $roleID[roleName]
// Returns the ID of the first role whose name matches (case-insensitive).
module.exports = async (context, args) => {
  const roleName = String(args[0] !== undefined ? args[0] : '').trim().toLowerCase();
  if (!roleName) return '[error: $roleID requires a role name]';
  if (!context.message?.guild) return '[error: $roleID — not in a guild]';

  const roles = await context.message.guild.roles.fetch();
  const role  = [...roles.values()].find(r => r.name.toLowerCase() === roleName);
  return role?.id ?? '[error: $roleID — role not found]';
};
