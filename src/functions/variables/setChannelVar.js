'use strict';

// $setChannelVar[name;value;channelID?]
// Set a persistent (in-memory) variable scoped to a specific channel.
// If channelID is omitted, uses the current channel.

const store = new Map(); // key: `channelID:name` → value

module.exports = async (context, args) => {
  const name      = args[0];
  const value     = args[1] !== undefined ? args[1] : '';
  const channelID = args[2] || context.message?.channel?.id;
  if (!name || !channelID) return '';
  store.set(`${channelID}:${String(name).toLowerCase()}`, value);
  return '';
};

module.exports._store = store;
