'use strict';

const { argError } = require('../../core/fnError');

// $resetInvites[userID]
// Resets all tracked invite counters (real, fake, left, bonus) for a user to 0.
module.exports = async (context, args) => {
  const userID  = String(args[0] !== undefined ? args[0] : '').trim();
  const guildID = context.message?.guild?.id ?? context.message?.guildId ?? '';

  if (!userID) return argError(context, 'userID', 'string', userID);
  if (!guildID) return '[error: Not in a guild!]';

  const tracker = context.client?._cenzoInviteTracker;
  if (!tracker) return '[error: InviteTracker not available!]';

  tracker.resetInvites(guildID, userID);
  return '';
};
