'use strict';

const { resolveMember } = require('../../core/resolveUser');

// $nickname[userID?]
// Returns the server nickname of a member, or their username if no nickname is set.
module.exports = async (context, args) => {
  const member = await resolveMember(context, args[0]);
  if (!member) return '';
  return member.nickname || member.user.username;
};
