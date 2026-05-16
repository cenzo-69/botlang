'use strict';

// $memberFakeInvites[userID]
// Returns the number of fake invites attributed to a user.
// (fake = users who joined via their invite but left almost immediately)
module.exports = async (context, args) => {
  const userID  = String(args[0] !== undefined ? args[0] : context.message?.author?.id ?? '').trim();
  const guildID = context.message?.guild?.id ?? context.message?.guildId ?? '';
  if (!userID || !guildID) return '0';

  const tracker = context.client?._cenzoInviteTracker;
  if (!tracker) return '[error: InviteTracker not available!]';

  return String(tracker.getInviterRecord(guildID, userID).fake ?? 0);
};
