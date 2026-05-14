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
  if (!raw) return '[error: $giveawayInfo — giveaway not found]';

  let data;
  try { data = JSON.parse(raw); } catch { return '[error: $giveawayInfo — corrupt data]'; }

  const value = data[field];
  if (value === undefined) return '[error: $giveawayInfo — unknown field]';
  if (Array.isArray(value)) return value.join(', ');
  return String(value);
};
