'use strict';

const { resolveMember } = require('../core/resolveUser');

// $displayName[userID?]  — guild display name (nickname if set, else username)
module.exports = async (context, args) => {
  const member = await resolveMember(context, args[0]);
  if (member) return member.displayName || member.user.username;
  // Fallback: no guild context
  return context.message?.author?.username || '';
};
