'use strict';

const db = require('../../core/db');

// $isBlacklisted[userID?;guildID?]
// Returns "true" if the user is blacklisted in this guild, otherwise "false".
// Defaults to the message author and current guild.
module.exports = async (context, args) => {
  const userID  = String(args[0] !== undefined ? args[0] : '').trim()
    || context.message?.author?.id
    || '';
  const guildID = String(args[1] !== undefined ? args[1] : '').trim()
    || context.message?.guildId
    || 'global';

  if (!userID) return 'false';

  return db.has(`__bl_${guildID}_${userID}`) ? 'true' : 'false';
};
