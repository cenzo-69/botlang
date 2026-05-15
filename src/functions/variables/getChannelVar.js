'use strict';

const fnError = require('../../core/fnError');
const { pool, init } = require('../../core/pgdb');

// $getChannelVar[name;channelID?;default?]
// Returns a channel-scoped variable from PostgreSQL. Falls back to `default` if not set.

module.exports = async (context, args) => {
  const name      = String(args[0] !== undefined ? args[0] : '').trim();
  const channelID = String(args[1] !== undefined ? args[1] : '').trim()
                    || context.message?.channelId
                    || context.interaction?.channelId;
  const fallback  = args[2] !== undefined ? String(args[2]) : '';

  if (!name) {
    return fnError('getChannelVar', 'variable name is required', {
      expected: '`name` (string), optional `channelID`, optional `default`',
      example:  '$getChannelVar[topic]  or  $getChannelVar[topic;;N/A]',
    });
  }
  if (!channelID) {
    return fnError('getChannelVar', 'could not determine channel ID', {
      tip:     'Provide a channelID as the second argument',
      example: '$getChannelVar[topic;123456789]',
    });
  }

  await init();
  const { rows } = await pool.query(
    'SELECT value FROM cenzo_channel_vars WHERE channel_id = $1 AND name = $2',
    [channelID, name.toLowerCase()]
  );
  return rows.length ? rows[0].value : fallback;
};
