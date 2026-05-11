'use strict';

// $resetChannelVar[name;channelID?]
// Delete a channel-scoped variable. If channelID is omitted, uses the current channel.

const { _store: store } = require('./setChannelVar');

module.exports = async (context, args) => {
  const name      = args[0];
  const channelID = args[1] || context.message?.channel?.id;
  if (!name || !channelID) return '';
  store.delete(`${channelID}:${String(name).toLowerCase()}`);
  return '';
};
