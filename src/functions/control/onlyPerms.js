'use strict';

const { PermissionFlagsBits } = require('discord.js');
const fnError = require('../../core/fnError');

// $onlyPerms[permissionName;errorMessage?]
// Stops execution if the author lacks the specified Discord permission.
// Works in both message commands and slash interactions.
//
// Permission names: ManageMessages | BanMembers | KickMembers | ManageRoles |
//                   Administrator | ManageGuild | ManageChannels | etc.
module.exports = async (context, args) => {
  const permName = String(args[0] !== undefined ? args[0] : '').trim();

  if (!permName) {
    return fnError('onlyPerms', 'permission name is required', {
      expected: 'a PermissionFlagsBits key like `BanMembers`, `ManageMessages`',
      example:  '$onlyPerms[ManageMessages;You need Manage Messages!]',
    });
  }

  const flag = PermissionFlagsBits[permName];
  if (flag === undefined) {
    return fnError('onlyPerms', `unknown permission "${permName}"`, {
      tip:     'See Discord permission names: Administrator, BanMembers, KickMembers, ManageMessages, ManageRoles, ManageGuild, ManageChannels, etc.',
      example: '$onlyPerms[BanMembers;You need Ban Members permission!]',
    });
  }

  const member = context.message?.member ?? context.interaction?.member;
  if (!member) {
    return fnError('onlyPerms', 'guild context is required', {
      tip: '$onlyPerms only works inside a server command',
    });
  }

  if (!member.permissions.has(flag)) {
    const msg = (args[1] !== undefined && String(args[1]).trim() !== '')
      ? String(args[1])
      : null;
    context._out.stopMessage = msg;
    context.stop();
  }

  return '';
};
