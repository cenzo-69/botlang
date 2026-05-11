'use strict';

// $ban[userID;reason?]
// Bans a user from the guild. Returns empty string on success.
module.exports = async (context, args) => {
  const guild  = context.message?.guild;
  if (!guild) return '[error: no guild]';
  const userID = String(args[0] || '').trim();
  if (!userID) return '[error: $ban requires a userID]';
  const reason = args[1] ? String(args[1]) : undefined;
  try {
    await guild.members.ban(userID, { reason });
    return '';
  } catch (err) {
    return `[error: ${err.message}]`;
  }
};
