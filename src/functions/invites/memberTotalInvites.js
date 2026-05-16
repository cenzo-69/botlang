'use strict';

// $memberTotalInvites[userID]
// Returns the effective total invite count: real + bonus - left - fake (min 0).
module.exports = async (context, args) => {
  const userID  = String(args[0] !== undefined ? args[0] : context.message?.author?.id ?? '').trim();
  const guildID = context.message?.guild?.id ?? context.message?.guildId ?? '';
  if (!userID || !guildID) return '0';

  const tracker = context.client?._cenzoInviteTracker;
  if (!tracker) return '[error: InviteTracker not available!]';

  return String(tracker.getTotalInvites(guildID, userID));
};
