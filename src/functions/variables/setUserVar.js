'use strict';

// $setUserVar[name;value;userID?]
// Set a persistent (in-memory) variable scoped to a specific user.
// If userID is omitted, uses the author of the current message.
// Persists for the bot's uptime (resets on restart).

const store = new Map(); // key: `userID:name` → value

module.exports = async (context, args) => {
  const name    = args[0];
  const value   = args[1] !== undefined ? args[1] : '';
  const userID  = args[2] || context.message?.author?.id;
  if (!name || !userID) return '';
  store.set(`${userID}:${String(name).toLowerCase()}`, value);
  return '';
};

module.exports._store = store;
