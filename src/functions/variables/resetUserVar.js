'use strict';

const fnError = require('../../core/fnError');
const { pool, init } = require('../../core/pgdb');

// $resetUserVar[name;userID?]
// Deletes a user-scoped variable from PostgreSQL.

module.exports = async (context, args) => {
  const name   = String(args[0] !== undefined ? args[0] : '').trim();
  const userID = String(args[1] !== undefined ? args[1] : '').trim()
                 || context.message?.author?.id
                 || context.interaction?.user?.id;

  if (!name) {
    return fnError('resetUserVar', 'variable name is required', {
      expected: '`name` (string), optional `userID`',
      example:  '$resetUserVar[coins]  or  $resetUserVar[coins;123456789]',
    });
  }
  if (!userID) {
    return fnError('resetUserVar', 'could not determine user ID', {
      tip:     'Provide a userID as the second argument',
      example: '$resetUserVar[coins;123456789]',
    });
  }

  await init();
  await pool.query(
    'DELETE FROM cenzo_user_vars WHERE user_id = $1 AND name = $2',
    [userID, name.toLowerCase()]
  );
  return '';
};
