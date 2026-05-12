'use strict';

const db = require('../../core/db');

// $getPoints[userID;guildID?]
// Get the current points for a user.
module.exports = async (context, args) => {
  const userID  = String(args[0] ?? '').trim();
  const guildID = String(args[1] ?? context.message?.guild?.id ?? 'global').trim();

  if (!userID) return '[getPoints error: no userID]';

  const key = `points:${guildID}:${userID}`;
  return String(db.get(key, 0));
};
