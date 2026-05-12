'use strict';

const { resolveMember } = require('../../core/resolveUser');

// $userServerAvatar[userID?]
// Returns the per-server (guild) avatar URL of a member.
// Falls back to their global avatar if they have no server avatar.
module.exports = async (context, args) => {
  const member = await resolveMember(context, args[0]);
  if (!member) return '';
  return member.displayAvatarURL({ size: 1024 }) || member.user.displayAvatarURL({ size: 1024 }) || '';
};
