'use strict';

const fnError = require('../../core/fnError');

// $setServerVar[name;value;guildID?]
// Sets a persistent server-scoped variable (in-memory, resets on restart).
// If guildID is omitted, uses the current guild.

const store = new Map(); // key: `guildID:name` → value

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

  store.set(`${guildID}:${name.toLowerCase()}`, value);
  return '';
};

module.exports._store = store;
