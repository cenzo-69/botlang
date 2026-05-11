'use strict';

// $unban[userID;reason?]
// Removes a ban from a user, allowing them to rejoin the server.
module.exports = async (context, args) => {
  const userID = String(args[0] !== undefined ? args[0] : '').trim();
  const reason = String(args[1] !== undefined ? args[1] : '').trim() || 'No reason provided';

  if (!userID) return '[error: $unban requires a userID]';
  if (!context.message?.guild) return '[error: $unban — not in a guild]';

  try {
    await context.message.guild.members.unban(userID, reason);
    return '';
  } catch (err) {
    return `[error: $unban — ${err.message}]`;
  }
};
