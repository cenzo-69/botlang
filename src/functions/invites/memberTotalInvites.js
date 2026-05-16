'use strict';

// $memberTotalInvites[userID?;breakdown?]
// Returns the effective total invite count: real + bonus - left - fake (min 0).
//
// userID    — user to look up (defaults to command author)
// breakdown — true/false: if true, appends a breakdown string
//             e.g. "10 (8 real · 1 left · 2 bonus · 0 fake)"
module.exports = async (context, args) => {
  const userID    = String(args[0] !== undefined ? args[0] : context.message?.author?.id ?? '').trim();
  const breakdown = String(args[1] !== undefined ? args[1] : 'false').trim().toLowerCase() === 'true';
  const guildID   = context.message?.guild?.id ?? context.message?.guildId ?? '';

  if (!userID || !guildID) return '0';

  const tracker = context.client?._cenzoInviteTracker;
  if (!tracker) return '[error: InviteTracker not available!]';

  const total = tracker.getTotalInvites(guildID, userID);

  if (!breakdown) return String(total);

  const rec = tracker.getInviterRecord(guildID, userID);
  return `${total} (${rec.real} real · ${rec.left} left · ${rec.bonus} bonus · ${rec.fake} fake)`;
};
