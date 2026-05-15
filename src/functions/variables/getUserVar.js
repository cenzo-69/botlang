'use strict';

const fnError = require('../../core/fnError');
const { pool, init } = require('../../core/pgdb');

// $getUserVar[name;userID?;default?]
// Returns a user-scoped variable from PostgreSQL. Falls back to `default` if not set.

module.exports = async (context, args) => {
  const name   = String(args[0] !== undefined ? args[0] : '').trim();
  const userID = String(args[1] !== undefined ? args[1] : '').trim()
                 || context.message?.author?.id
                 || context.interaction?.user?.id;
  const fallback = args[2] !== undefined ? String(args[2]) : '';

  if (!name) {
    return fnError('getUserVar', 'variable name is required', {
      expected: '`name` (string), optional `userID`, optional `default`',
      example:  '$getUserVar[coins]  or  $getUserVar[coins;;0]',
    });
  }
  if (!userID) {
    return fnError('getUserVar', 'could not determine user ID', {
      tip:     'Provide a userID as the second argument',
      example: '$getUserVar[coins;123456789]',
    });
  }

  await init();
  const { rows } = await pool.query(
    'SELECT value FROM cenzo_user_vars WHERE user_id = $1 AND name = $2',
    [userID, name.toLowerCase()]
  );
  return rows.length ? rows[0].value : fallback;
};
