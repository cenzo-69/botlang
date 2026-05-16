'use strict';

// $memberInvite[userID?;format?]
// Returns info about the person who invited this member (tracked via InviteTracker).
//
// userID  — the member to look up (defaults to command author)
// format options:
//   id       (default) — raw user ID
//   mention            — <@userID>
//   username           — fetched username (requires API call)
//   code               — the invite code they used
//   url                — the full invite URL they used
module.exports = async (context, args) => {
  const memberID = String(args[0] !== undefined ? args[0] : context.message?.author?.id ?? '').trim();
  const format   = String(args[1] !== undefined ? args[1] : 'id').trim().toLowerCase();

  if (!memberID) return '';

  const tracker = context.client?._cenzoInviteTracker;
  if (!tracker) return '[error: InviteTracker not available!]';

  const inviterID = tracker.getInviterOf(memberID);
  if (!inviterID) return '';

  switch (format) {
    case 'mention':  return `<@${inviterID}>`;
    case 'code':     return tracker.getInviteCodeUsedBy(memberID) ?? '';
    case 'url': {
      const code = tracker.getInviteCodeUsedBy(memberID);
      return code ? `https://discord.gg/${code}` : '';
    }
    case 'username': {
      try {
        const user = await context.client.users.fetch(inviterID);
        return user.username;
      } catch { return inviterID; }
    }
    default: return inviterID;
  }
};
