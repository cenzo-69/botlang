'use strict';

// $highestRole[(userID)]
// Returns the name of the author's (or specified user's) highest-positioned role.
module.exports = async (context, args) => {
  const userID = String(args[0] || '').trim() || context.message?.author?.id;
  const guild  = context.message?.guild;
  if (!guild) return '[error: No guild!]';
  try {
    const member = await guild.members.fetch(userID);
    return member.roles.highest?.name ?? '';
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
