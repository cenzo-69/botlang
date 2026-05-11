'use strict';

const db = require('../../core/db');

// $warn[userID;reason?;guildID?]
// Adds a warning to a user. Warnings are stored persistently in the db.
// Returns the user's new total warning count.
// Key format: __warn_<guildID>_<userID>  →  JSON array of {reason, timestamp}
module.exports = async (context, args) => {
  const userID  = String(args[0] !== undefined ? args[0] : '').trim();
  const reason  = String(args[1] !== undefined ? args[1] : '').trim() || 'No reason provided';
  const guildID = String(args[2] !== undefined ? args[2] : '').trim()
    || context.message?.guildId
    || 'global';

  if (!userID) return '[error: $warn requires a userID]';

  const key      = `__warn_${guildID}_${userID}`;
  const existing = db.get(key, null);
  const warns    = existing ? JSON.parse(existing) : [];

  warns.push({ reason, timestamp: Date.now() });
  db.set(key, JSON.stringify(warns));

  return String(warns.length);
};
