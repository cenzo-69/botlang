'use strict';

const { argError } = require('../../core/fnError');

// $addBonusInvites[userID;amount]
// Adds bonus invites to a user's tracked invite count. Returns the new bonus total.
module.exports = async (context, args) => {
  const userID  = String(args[0] !== undefined ? args[0] : '').trim();
  const amount  = parseInt(args[1]) || 0;
  const guildID = context.message?.guild?.id ?? context.message?.guildId ?? '';

  if (!userID) return argError(context, 'userID', 'string', userID);
  if (!guildID) return '[error: Not in a guild!]';

  const tracker = context.client?._cenzoInviteTracker;
  if (!tracker) return '[error: InviteTracker not available!]';

  tracker.addBonus(guildID, userID, amount);
  return String(tracker.getInviterRecord(guildID, userID).bonus);
};
