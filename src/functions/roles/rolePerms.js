'use strict';

const { argError } = require('../../core/fnError');

// $rolePerms[guildID;roleID;(separator)]
// Returns a list of permission names held by a role.
module.exports = async (context, args) => {
  const guildID = String(args[0] || '').trim();
  const roleID  = String(args[1] || '').trim();
  const sep     = String(args[2] !== undefined ? args[2] : ', ');
  if (!roleID) return argError(context, 'role ID', 'Role', roleID);
  let guild = context.message?.guild;
  if (guildID) {
    try { guild = await context.client.guilds.fetch(guildID); } catch { return '[error: guild not found]'; }
  }
  if (!guild) return '[error: no guild]';
  const role = guild.roles.cache.get(roleID);
  if (!role) return '[error: role not found]';
  return role.permissions.toArray().join(sep);
};
