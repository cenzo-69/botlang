'use strict';

const { resolveMember } = require('../../core/resolveUser');

// $isBot[userID?]  — returns "true" if the user is a bot, "false" otherwise
module.exports = async (context, args) => {
  const member = await resolveMember(context, args[0]);
  if (member) return String(member.user.bot);
  // Fallback: check the author directly
  return String(context.message?.author?.bot ?? false);
};
