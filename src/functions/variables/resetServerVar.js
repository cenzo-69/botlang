'use strict';

// $resetServerVar[name;guildID?]
// Delete a server-scoped variable. If guildID is omitted, uses the current guild.

const { _store: store } = require('./setServerVar');

module.exports = async (context, args) => {
  const name    = args[0];
  const guildID = args[1] || context.message?.guild?.id;
  if (!name || !guildID) return '';
  store.delete(`${guildID}:${String(name).toLowerCase()}`);
  return '';
};
