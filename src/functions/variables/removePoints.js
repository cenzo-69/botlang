'use strict';

const db = require('../../core/db');

// $removePoints[userID;amount;guildID?]
// Remove points from a user (floor at 0).
module.exports = async (context, args) => {
  const userID  = String(args[0] ?? '').trim();
  const amount  = parseFloat(args[1]);
  const guildID = String(args[2] ?? context.message?.guild?.id ?? 'global').trim();

  if (!userID)       return '[removePoints error: no userID]';
  if (isNaN(amount)) return '[removePoints error: invalid amount]';

  const key     = `points:${guildID}:${userID}`;
  const current = parseFloat(db.get(key, 0));
  const newVal  = Math.max(0, current - amount);
  db.set(key, newVal);
  return String(newVal);
};
