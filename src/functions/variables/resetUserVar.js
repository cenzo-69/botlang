'use strict';

// $resetUserVar[name;userID?]
// Delete a user-scoped variable. If userID is omitted, uses the message author.

const { _store: store } = require('./setUserVar');

module.exports = async (context, args) => {
  const name   = args[0];
  const userID = args[1] || context.message?.author?.id;
  if (!name || !userID) return '';
  store.delete(`${userID}:${String(name).toLowerCase()}`);
  return '';
};
