'use strict';

// $memberInviteCode[userID]
// Returns the invite code used by this member when they joined.
// Returns empty string if unknown.
module.exports = async (context, args) => {
  const memberID = String(args[0] !== undefined ? args[0] : context.message?.author?.id ?? '').trim();
  if (!memberID) return '';

  const tracker = context.client?._cenzoInviteTracker;
  if (!tracker) return '[error: InviteTracker not available!]';

  return tracker.getInviteCodeUsedBy(memberID) ?? '';
};
