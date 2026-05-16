'use strict';

// $memberInvite[userID]
// Returns the user ID of the person who invited this member (tracked via InviteTracker).
// Returns empty string if the member's inviter is unknown.
module.exports = async (context, args) => {
  const memberID = String(args[0] !== undefined ? args[0] : context.message?.author?.id ?? '').trim();
  if (!memberID) return '';

  const tracker = context.client?._cenzoInviteTracker;
  if (!tracker) return '[error: InviteTracker not available!]';

  return tracker.getInviterOf(memberID) ?? '';
};
