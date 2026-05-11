'use strict';

const { resolveMember } = require('../core/resolveUser');

// $userJoined[userID?]  — ISO 8601 server join date (empty if not in guild)
module.exports = async (context, args) => {
  const member = await resolveMember(context, args[0]);
  if (!member?.joinedAt) return '';
  return member.joinedAt.toISOString();
};
