'use strict';

const fnError = require('../../core/fnError');

// $setUserVar[name;value;userID?]
// Sets a persistent user-scoped variable (in-memory, resets on restart).
// If userID is omitted, uses the current message author.

const store = new Map(); // key: `userID:name` → value

module.exports = async (context, args) => {
  const name   = String(args[0] !== undefined ? args[0] : '').trim();
  const value  = args[1] !== undefined ? String(args[1]) : '';
  const userID = String(args[2] !== undefined ? args[2] : '').trim()
                 || context.message?.author?.id
                 || context.interaction?.user?.id;

  if (!name) {
    return fnError('setUserVar', 'variable name is required', {
      expected: '`name` (string), `value` (any), optional `userID`',
      example:  '$setUserVar[coins;500]',
    });
  }
  if (!userID) {
    return fnError('setUserVar', 'could not determine user ID', {
      tip:     'Provide a userID as the third argument',
      example: '$setUserVar[coins;500;123456789]',
    });
  }

  store.set(`${userID}:${name.toLowerCase()}`, value);
  return '';
};

module.exports._store = store;
