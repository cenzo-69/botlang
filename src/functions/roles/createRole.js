'use strict';

// $createRole[name;color?]
// Creates a role in the guild. color is a hex color like #FF0000.
// Returns the new role ID on success.
module.exports = async (context, args) => {
  const guild = context.message?.guild;
  if (!guild) return '[error: no guild]';
  const name  = String(args[0] || 'New Role');
  const color = args[1] ? parseInt(String(args[1]).replace(/^#/, ''), 16) : 0;
  try {
    const role = await guild.roles.create({ name, color: isNaN(color) ? 0 : color });
    return role.id;
  } catch (err) {
    return `[error: ${err.message}]`;
  }
};
