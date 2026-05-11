'use strict';

// $kick[userID;reason?]
// Kicks a member from the guild. Returns empty string on success.
module.exports = async (context, args) => {
  const guild  = context.message?.guild;
  if (!guild) return '[error: no guild]';
  const userID = String(args[0] || '').trim();
  if (!userID) return '[error: $kick requires a userID]';
  const reason = args[1] ? String(args[1]) : undefined;
  try {
    const member = await guild.members.fetch(userID);
    await member.kick(reason);
    return '';
  } catch (err) {
    return `[error: ${err.message}]`;
  }
};
