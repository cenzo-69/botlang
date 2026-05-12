'use strict';

const fnError = require('../../core/fnError');

// $getServerVar[name;guildID?;default?]
// Returns a server-scoped variable. Falls back to `default` if not set.

const { _store: store } = require('./setServerVar');

module.exports = async (context, args) => {
  const name    = String(args[0] !== undefined ? args[0] : '').trim();
  const guildID = String(args[1] !== undefined ? args[1] : '').trim()
                  || context.message?.guild?.id
                  || context.interaction?.guildId;
  const fallback = args[2] !== undefined ? String(args[2]) : '';

  if (!name) {
    return fnError('getServerVar', 'variable name is required', {
      expected: '`name` (string), optional `guildID`, optional `default`',
      example:  '$getServerVar[welcome]  or  $getServerVar[welcome;;N/A]',
    });
  }
  if (!guildID) {
    return fnError('getServerVar', 'could not determine guild ID', {
      tip:     'Provide a guildID as the second argument, or run inside a server',
      example: '$getServerVar[welcome;123456789]',
    });
  }

  const key = `${guildID}:${name.toLowerCase()}`;
  return store.has(key) ? String(store.get(key)) : fallback;
};
