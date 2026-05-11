'use strict';

// $getServerVar[name;guildID?;default?]
// Get a server-scoped variable. If guildID is omitted, uses the current guild.

const { _store: store } = require('./setServerVar');

module.exports = async (context, args) => {
  const name     = args[0];
  const guildID  = args[1] || context.message?.guild?.id;
  const fallback = args[2] !== undefined ? args[2] : '';
  if (!name || !guildID) return fallback;
  const key = `${guildID}:${String(name).toLowerCase()}`;
  return store.has(key) ? String(store.get(key)) : fallback;
};
