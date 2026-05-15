'use strict';

const fnError = require('../../core/fnError');
const { pool, init } = require('../../core/pgdb');

// $setServerVar[name;value;guildID?]
// Sets a persistent server-scoped variable stored in PostgreSQL.
// Survives bot restarts. If guildID is omitted, uses the current guild.

module.exports = async (context, args) => {
  const name    = String(args[0] !== undefined ? args[0] : '').trim();
  const value   = args[1] !== undefined ? String(args[1]) : '';
  const guildID = String(args[2] !== undefined ? args[2] : '').trim()
                  || context.message?.guild?.id
                  || context.interaction?.guildId;

  if (!name) {
    return fnError('setServerVar', 'variable name is required', {
      expected: '`name` (string), `value` (any), optional `guildID`',
      example:  '$setServerVar[welcome;Hello!]',
    });
  }
  if (!guildID) {
    return fnError('setServerVar', 'could not determine guild ID', {
      tip:     'Provide a guildID as the third argument, or run inside a server',
      example: '$setServerVar[welcome;Hello!;123456789]',
    });
  }

  await init();
  await pool.query(
    `INSERT INTO cenzo_server_vars (guild_id, name, value) VALUES ($1, $2, $3)
     ON CONFLICT (guild_id, name) DO UPDATE SET value = EXCLUDED.value`,
    [guildID, name.toLowerCase(), value]
  );
  return '';
};
