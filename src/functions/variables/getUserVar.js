'use strict';

const fnError = require('../../core/fnError');

// $getUserVar[name;userID?;default?]
// Returns a user-scoped variable. Falls back to `default` if not set.

const { _store: store } = require('./setUserVar');

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

  const key = `${userID}:${name.toLowerCase()}`;
  return store.has(key) ? String(store.get(key)) : fallback;
};
