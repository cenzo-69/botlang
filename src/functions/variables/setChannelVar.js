'use strict';

const fnError = require('../../core/fnError');
const { pool, init } = require('../../core/pgdb');

// $setChannelVar[name;value;channelID?]
// Sets a persistent channel-scoped variable in PostgreSQL.
// If channelID is omitted, uses the current channel.

module.exports = async (context, args) => {
  const name      = String(args[0] !== undefined ? args[0] : '').trim();
  const value     = args[1] !== undefined ? String(args[1]) : '';
  const channelID = String(args[2] !== undefined ? args[2] : '').trim()
                    || context.message?.channelId
                    || context.interaction?.channelId;

  if (!name) {
    return fnError('setChannelVar', 'variable name is required', {
      expected: '`name` (string), `value` (any), optional `channelID`',
      example:  '$setChannelVar[topic;General chat]',
    });
  }
  if (!channelID) {
    return fnError('setChannelVar', 'could not determine channel ID', {
      tip:     'Provide a channelID as the third argument',
      example: '$setChannelVar[topic;General;123456789]',
    });
  }

  await init();
  await pool.query(
    `INSERT INTO cenzo_channel_vars (channel_id, name, value) VALUES ($1, $2, $3)
     ON CONFLICT (channel_id, name) DO UPDATE SET value = EXCLUDED.value`,
    [channelID, name.toLowerCase(), value]
  );
  return '';
};
