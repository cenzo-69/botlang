'use strict';

// $hasRole[userID;roleID]
// Returns "true" if the member has the role, "false" otherwise.
module.exports = async (context, args) => {
  const guild  = context.message?.guild;
  if (!guild) return 'false';
  const userID = String(args[0] || '').trim();
  const roleID = String(args[1] || '').trim();
  if (!userID || !roleID) return 'false';
  try {
    const member = await guild.members.fetch(userID);
    return String(member.roles.cache.has(roleID));
  } catch {
    return 'false';
  }
};
