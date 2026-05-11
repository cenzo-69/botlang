'use strict';

// $getUserVar[name;userID?;default?]
// Get a user-scoped variable. If userID is omitted, uses the message author.

const { _store: store } = require('./setUserVar');

module.exports = async (context, args) => {
  const name     = args[0];
  const userID   = args[1] || context.message?.author?.id;
  const fallback = args[2] !== undefined ? args[2] : '';
  if (!name || !userID) return fallback;
  const key = `${userID}:${String(name).toLowerCase()}`;
  return store.has(key) ? String(store.get(key)) : fallback;
};
