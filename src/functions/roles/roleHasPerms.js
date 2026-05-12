'use strict';
// $roleHasPerms[guildID;roleID;perm1;perm2;...]  — "true" if role has ALL listed permissions
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim();
  const roleID  = String(args[1] !== undefined ? args[1] : '').trim();
  const perms   = args.slice(2).map(a => String(a).trim()).filter(Boolean);
  if (!guildID || !roleID) return '[error: $roleHasPerms — guildID and roleID are required]';
  if (!perms.length) return '[error: $roleHasPerms — at least one permission is required]';
  try {
    const guild = await context.client?.guilds.fetch(guildID);
    const role  = guild?.roles.cache.get(roleID);
    if (!role) return '[error: $roleHasPerms — role not found]';
    return String(role.permissions.has(perms));
  } catch (err) { return `[error: $roleHasPerms — ${err.message}]`; }
};
