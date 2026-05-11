'use strict';

// $getChannelVar[name;channelID?;default?]
// Get a channel-scoped variable. If channelID is omitted, uses the current channel.

const { _store: store } = require('./setChannelVar');

module.exports = async (context, args) => {
  const name      = args[0];
  const channelID = args[1] || context.message?.channel?.id;
  const fallback  = args[2] !== undefined ? args[2] : '';
  if (!name || !channelID) return fallback;
  const key = `${channelID}:${String(name).toLowerCase()}`;
  return store.has(key) ? String(store.get(key)) : fallback;
};
