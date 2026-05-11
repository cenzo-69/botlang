'use strict';

// $setServerVar[name;value;guildID?]
// Set a persistent (in-memory) variable scoped to a specific server/guild.
// If guildID is omitted, uses the current guild.

const store = new Map(); // key: `guildID:name` → value

module.exports = async (context, args) => {
  const name    = args[0];
  const value   = args[1] !== undefined ? args[1] : '';
  const guildID = args[2] || context.message?.guild?.id;
  if (!name || !guildID) return '';
  store.set(`${guildID}:${String(name).toLowerCase()}`, value);
  return '';
};

module.exports._store = store;
