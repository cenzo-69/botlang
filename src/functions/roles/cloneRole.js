'use strict';
// $cloneRole[guildID;roleID;name?;reason?]  — clones a role and returns new role ID
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  const roleID  = String(args[1] !== undefined ? args[1] : '').trim();
  const name    = args[2] !== undefined ? String(args[2]).trim() : undefined;
  const reason  = args[3] !== undefined ? String(args[3]) : undefined;
  if (!guildID || !roleID) return '[error: $cloneRole — guildID and roleID are required]';
  try {
    const guild = await context.client?.guilds.fetch(guildID);
    const role  = guild?.roles.cache.get(roleID);
    if (!role) return '[error: $cloneRole — role not found]';
    const clone = await guild.roles.create({
      name:        name || role.name + ' (copy)',
      color:       role.color,
      hoist:       role.hoist,
      permissions: role.permissions,
      mentionable: role.mentionable,
      reason,
    });
    return clone.id;
  } catch (err) { return `[error: $cloneRole — ${err.message}]`; }
};
