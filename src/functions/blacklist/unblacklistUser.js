'use strict';

const { argError } = require('../../core/fnError');

const db = require('../../core/db');

// $unblacklistUser[userID;guildID?]
// Removes a user from the guild blacklist.
module.exports = async (context, args) => {
  const userID  = String(args[0] !== undefined ? args[0] : '').trim();
  const guildID = String(args[1] !== undefined ? args[1] : '').trim()
    || context.message?.guildId
    || 'global';

  if (!userID) return argError(context, 'user ID', 'Snowflake', userID);

  db.delete(`__bl_${guildID}_${userID}`);
  return '';
};
