'use strict';

const db = require('../../core/db');

// $giveawayList[guildID?;separator?]
// Returns a separated list of active giveaway message IDs for the guild.
// If guildID is omitted, uses the current guild.
module.exports = async (context, args) => {
  const guildID = String(args[0] !== undefined ? args[0] : '').trim()
    || context.message?.guildId || '';
  const sep = String(args[1] !== undefined ? args[1] : ', ');

  const all  = db.all();
  const ids  = [];

  for (const [key, val] of Object.entries(all)) {
    if (!key.startsWith('__giveaway_')) continue;
    try {
      const data = JSON.parse(val);
      if (!data.active) continue;
      if (guildID && data.guildID && data.guildID !== guildID) continue;
      ids.push(key.replace('__giveaway_', ''));
    } catch { /* skip corrupt entries */ }
  }

  return ids.join(sep);
};
