'use strict';

const { argError } = require('../../core/fnError');

const db = require('../../core/db');

// $giveawayWinners[messageID;separator?]
// Returns a separated list of winner user IDs from a concluded giveaway.
module.exports = async (context, args) => {
  const messageID = String(args[0] !== undefined ? args[0] : '').trim();
  const sep       = String(args[1] !== undefined ? args[1] : ', ');

  if (!messageID) return argError(context, 'message ID', 'Snowflake', messageID);

  const raw = db.get(`__giveaway_${messageID}`, null);
  if (!raw) return '[error: Giveaway not found!]';

  let data;
  try { data = JSON.parse(raw); } catch { return '[error: Corrupt data!]'; }

  if (!data.winners?.length) return '';
  return data.winners.join(sep);
};
