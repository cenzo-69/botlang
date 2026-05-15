'use strict';

// $lowestRole[(userID)]
// Returns the name of the author's (or specified user's) lowest-positioned role.
module.exports = async (context, args) => {
  const userID = String(args[0] || '').trim() || context.message?.author?.id;
  const guild  = context.message?.guild;
  if (!guild) return '[error: No guild!]';
  try {
    const member = await guild.members.fetch(userID);
    const sorted = [...member.roles.cache.values()].sort((a, b) => a.position - b.position);
    return sorted[0]?.name ?? '';
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
