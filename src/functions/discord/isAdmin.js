'use strict';

const { resolveMember } = require('../../core/resolveUser');
const { PermissionFlagsBits } = require('discord.js');

// $isAdmin[userID?]
// Returns "true" if the member has the Administrator permission.
module.exports = async (context, args) => {
  const member = await resolveMember(context, args[0]);
  if (!member) return 'false';
  return String(member.permissions.has(PermissionFlagsBits.Administrator));
};
