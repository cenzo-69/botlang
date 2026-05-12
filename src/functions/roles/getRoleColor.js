'use strict';

// $getRoleColor[roleID]
// Returns the hex color of a role (e.g. "#ff0000"). Returns "#000000" if no color is set.
module.exports = async (context, args) => {
  const roleID = String(args[0] !== undefined ? args[0] : '').trim();
  if (!roleID) return '[error: $getRoleColor requires a roleID]';
  if (!context.message?.guild) return '[error: $getRoleColor — not in a guild]';

  try {
    const role = await context.message.guild.roles.fetch(roleID);
    if (!role) return '[error: $getRoleColor — role not found]';
    return role.hexColor;
  } catch (err) {
    return `[error: $getRoleColor — ${err.message}]`;
  }
};
