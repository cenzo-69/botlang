'use strict';

const { argError } = require('../../core/fnError');

const db = require('../../core/db');

// $giveawayInfo[messageID;field]
// Returns a specific field from a giveaway's stored data.
// Fields: prize | winnerCount | channelID | guildID | endsAt | active | createdAt
module.exports = async (context, args) => {
  const messageID = String(args[0] !== undefined ? args[0] : '').trim();
  const field     = String(args[1] !== undefined ? args[1] : '').trim().toLowerCase();

  if (!messageID) return argError(context, 'message ID', 'Snowflake', messageID);
  if (!field)     return argError(context, 'field', 'string', field);

  const raw = db.get(`__giveaway_${messageID}`, null);
  if (!raw) return '[error: Giveaway not found!]';

  let data;
  try { data = JSON.parse(raw); } catch { return '[error: Corrupt data!]'; }

  const value = data[field];
  if (value === undefined) return '[error: Unknown field!]';
  if (Array.isArray(value)) return value.join(', ');
  return String(value);
};
