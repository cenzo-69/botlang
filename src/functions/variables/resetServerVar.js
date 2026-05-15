'use strict';

const fnError = require('../../core/fnError');
const { pool, init } = require('../../core/pgdb');

// $resetServerVar[name;guildID?]
// Deletes a server-scoped variable from PostgreSQL.

module.exports = async (context, args) => {
  const name    = String(args[0] !== undefined ? args[0] : '').trim();
  const guildID = String(args[1] !== undefined ? args[1] : '').trim()
                  || context.message?.guild?.id
                  || context.interaction?.guildId;

  if (!name) {
    return fnError('resetServerVar', 'variable name is required', {
      expected: '`name` (string), optional `guildID`',
      example:  '$resetServerVar[welcome]',
    });
  }
  if (!guildID) {
    return fnError('resetServerVar', 'could not determine guild ID', {
      tip:     'Provide a guildID as the second argument',
      example: '$resetServerVar[welcome;123456789]',
    });
  }

  await init();
  await pool.query(
    'DELETE FROM cenzo_server_vars WHERE guild_id = $1 AND name = $2',
    [guildID, name.toLowerCase()]
  );
  return '';
};
