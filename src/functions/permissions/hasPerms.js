'use strict';

const { argError } = require('../../core/fnError');

// $hasPerms[userID;perm1;perm2;...]
// Returns "true" if the member has ALL listed permissions, otherwise "false".
// Permissions use Discord.js PermissionFlagsBits names (e.g. Administrator, BanMembers).
module.exports = async (context, args) => {
  const userID = String(args[0] !== undefined ? args[0] : '').trim();
  const perms  = args.slice(1).map(p => String(p).trim()).filter(Boolean);

  if (!userID) return argError(context, 'user ID', 'Snowflake', userID);
  if (!perms.length) return '[error: $hasPerms requires at least one permission]';
  if (!context.client) return '[error: $hasPerms — no client available]';

  try {
    const guild  = context.message?.guild;
    if (!guild) return '[error: $hasPerms — not in a guild]';

    const member = await guild.members.fetch(userID).catch(() => null);
    if (!member) return '[error: $hasPerms — member not found]';

    for (const perm of perms) {
      if (!member.permissions.has(perm)) return 'false';
    }
    return 'true';
  } catch (err) {
    return `[error: $hasPerms — ${err.message}]`;
  }
};
