'use strict';

// $modifyRole[roleID;name?;color?;hoist?;mentionable?;reason?]
// Edits multiple role properties in one call. Pass empty string to skip a field.
module.exports = async (context, args) => {
  const roleID      = String(args[0] !== undefined ? args[0] : '').trim();
  const name        = String(args[1] !== undefined ? args[1] : '').trim();
  const color       = String(args[2] !== undefined ? args[2] : '').trim();
  const hoist       = String(args[3] !== undefined ? args[3] : '').trim().toLowerCase();
  const mentionable = String(args[4] !== undefined ? args[4] : '').trim().toLowerCase();
  const reason      = String(args[5] !== undefined ? args[5] : '').trim() || 'No reason provided';

  if (!roleID) return '[error: $modifyRole requires a roleID]';
  if (!context.message?.guild) return '[error: $modifyRole — not in a guild]';

  try {
    const role = await context.message.guild.roles.fetch(roleID);
    if (!role) return '[error: $modifyRole — role not found]';

    const edits = {};
    if (name)                     edits.name        = name;
    if (color)                    edits.color        = color;
    if (hoist === 'true' || hoist === 'false') edits.hoist = hoist === 'true';
    if (mentionable === 'true' || mentionable === 'false') edits.mentionable = mentionable === 'true';

    await role.edit(edits, reason);
    return '';
  } catch (err) {
    return `[error: $modifyRole — ${err.message}]`;
  }
};
