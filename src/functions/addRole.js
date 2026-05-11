'use strict';

// $addRole[userID;roleID]
// Adds a role to a guild member. Returns empty string on success.
module.exports = async (context, args) => {
  const guild  = context.message?.guild;
  if (!guild) return '[error: no guild]';
  const userID = String(args[0] || '').trim();
  const roleID = String(args[1] || '').trim();
  if (!userID || !roleID) return '[error: $addRole requires userID and roleID]';
  try {
    const member = await guild.members.fetch(userID);
    await member.roles.add(roleID);
    return '';
  } catch (err) {
    return `[error: ${err.message}]`;
  }
};
