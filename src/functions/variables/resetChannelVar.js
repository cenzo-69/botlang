'use strict';

const fnError = require('../../core/fnError');
const { pool, init } = require('../../core/pgdb');

// $resetChannelVar[name;channelID?]
// Deletes a channel-scoped variable from PostgreSQL.

module.exports = async (context, args) => {
  const name      = String(args[0] !== undefined ? args[0] : '').trim();
  const channelID = String(args[2] !== undefined ? args[2] : '').trim()
                    || context.message?.channelId
                    || context.interaction?.channelId;

  if (!name) {
    return fnError('resetChannelVar', 'variable name is required', {
      expected: '`name` (string), optional `channelID`',
      example:  '$resetChannelVar[topic]',
    });
  }
  if (!channelID) {
    return fnError('resetChannelVar', 'could not determine channel ID', {
      tip:     'Provide a channelID as the second argument',
      example: '$resetChannelVar[topic;123456789]',
    });
  }

  await init();
  await pool.query(
    'DELETE FROM cenzo_channel_vars WHERE channel_id = $1 AND name = $2',
    [channelID, name.toLowerCase()]
  );
  return '';
};
