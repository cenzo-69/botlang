'use strict';

const db = require('../../core/db');

// $blacklistUser[userID;guildID?]
// Adds a user to the guild blacklist. Blacklisted users are blocked from
// commands that include $isBlacklisted checks.
// Stored as: __bl_<guildID>_<userID> = "1" in persistent db.
module.exports = async (context, args) => {
  const userID  = String(args[0] !== undefined ? args[0] : '').trim();
  const guildID = String(args[1] !== undefined ? args[1] : '').trim()
    || context.message?.guildId
    || 'global';

  if (!userID) return '[error: $blacklistUser requires a userID]';

  db.set(`__bl_${guildID}_${userID}`, '1');
  return '';
};
