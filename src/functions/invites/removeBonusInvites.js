'use strict';

const { argError } = require('../../core/fnError');

// $removeBonusInvites[userID;amount]
// Removes bonus invites from a user's tracked count (minimum 0). Returns new bonus total.
module.exports = async (context, args) => {
  const userID  = String(args[0] !== undefined ? args[0] : '').trim();
  const amount  = parseInt(args[1]) || 0;
  const guildID = context.message?.guild?.id ?? context.message?.guildId ?? '';

  if (!userID) return argError(context, 'userID', 'string', userID);
  if (!guildID) return '[error: Not in a guild!]';

  const tracker = context.client?._cenzoInviteTracker;
  if (!tracker) return '[error: InviteTracker not available!]';

  tracker.removeBonus(guildID, userID, amount);
  return String(tracker.getInviterRecord(guildID, userID).bonus);
};
