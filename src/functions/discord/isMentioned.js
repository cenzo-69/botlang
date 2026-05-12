'use strict';

// $isMentioned[userID]
// Returns "true" if the specified user was mentioned in the message.
module.exports = async (context, args) => {
  const userID = String(args[0] || '').trim();
  if (!context.message) return 'false';
  if (userID) {
    return String(context.message.mentions?.users?.has(userID) ?? false);
  }
  return String((context.message.mentions?.users?.size ?? 0) > 0);
};
