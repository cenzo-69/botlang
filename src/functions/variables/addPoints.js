'use strict';

const db = require('../../core/db');

// $addPoints[userID;amount;guildID?]
// Add points to a user. Points are stored per-guild (or global if no guildID).
module.exports = async (context, args) => {
  const userID  = String(args[0] ?? '').trim();
  const amount  = parseFloat(args[1]);
  const guildID = String(args[2] ?? context.message?.guild?.id ?? 'global').trim();

  if (!userID)    return '[addPoints error: no userID]';
  if (isNaN(amount)) return '[addPoints error: invalid amount]';

  const key     = `points:${guildID}:${userID}`;
  const current = parseFloat(db.get(key, 0));
  const newVal  = current + amount;
  db.set(key, newVal);
  return String(newVal);
};
