'use strict';

// $memberInvites[userID]
// Returns the number of real (non-fake, non-left) tracked invites for a user.
module.exports = async (context, args) => {
  const userID  = String(args[0] !== undefined ? args[0] : context.message?.author?.id ?? '').trim();
  const guildID = context.message?.guild?.id ?? context.message?.guildId ?? '';
  if (!userID || !guildID) return '0';

  const tracker = context.client?._cenzoInviteTracker;
  if (!tracker) return '[error: InviteTracker not available!]';

  const rec = tracker.getInviterRecord(guildID, userID);
  return String(rec.real ?? 0);
};
