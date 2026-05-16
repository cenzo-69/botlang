'use strict';

// $memberBonusInvites[userID]
// Returns the number of bonus invites manually added to a user.
module.exports = async (context, args) => {
  const userID  = String(args[0] !== undefined ? args[0] : context.message?.author?.id ?? '').trim();
  const guildID = context.message?.guild?.id ?? context.message?.guildId ?? '';
  if (!userID || !guildID) return '0';

  const tracker = context.client?._cenzoInviteTracker;
  if (!tracker) return '[error: InviteTracker not available!]';

  return String(tracker.getInviterRecord(guildID, userID).bonus ?? 0);
};
