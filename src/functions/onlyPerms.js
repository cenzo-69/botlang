'use strict';

const { PermissionFlagsBits } = require('discord.js');

// $onlyPerms[permissionName;errorMessage?]
//
// Stops execution if the message author does NOT have the given permission.
//
// permissionName must match a discord.js PermissionFlagsBits key exactly, e.g.:
//   ManageMessages, Administrator, BanMembers, KickMembers, ManageRoles, etc.
//
// Examples:
//   $onlyPerms[ManageMessages;You need Manage Messages to use this!]
//   $onlyPerms[Administrator]
module.exports = async (context, args) => {
  const permName = String(args[0] || '').trim();
  if (!permName) return '[error: $onlyPerms requires a permission name]';

  const flag = PermissionFlagsBits[permName];
  if (flag === undefined) return `[error: unknown permission "${permName}"]`;

  const member = context.message?.member;
  if (!member) return '[error: $onlyPerms requires a guild context]';

  if (!member.permissions.has(flag)) {
    const msg = (args[1] !== undefined && args[1] !== '') ? args[1] : null;
    context._out.stopMessage = msg;
    context.stop();
  }

  return '';
};
