'use strict';

const { argError } = require('../../core/fnError');

// $setRoleColor[roleID;color;reason?]
// Sets a role's color. color can be a hex code (#FF0000), decimal int, or color name.
module.exports = async (context, args) => {
  const roleID = String(args[0] !== undefined ? args[0] : '').trim();
  const color  = String(args[1] !== undefined ? args[1] : '').trim();
  const reason = String(args[2] !== undefined ? args[2] : '').trim() || 'No reason provided';

  if (!roleID) return argError(context, 'role ID', 'Role', roleID);
  if (!color)  return argError(context, 'color', 'HexColor', color);
  if (!context.message?.guild) return '[error: Not in a guild!]';

  try {
    const role = await context.message.guild.roles.fetch(roleID);
    if (!role) return '[error: Role not found!]';
    await role.setColor(color, reason);
    return '';
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
