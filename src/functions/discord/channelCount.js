'use strict';

// $channelCount
// Returns the total number of channels in the current guild.
module.exports = async (context, args) => {
  if (!context.message?.guild) return '[error: no guild]';
  return String(context.message.guild.channels.cache.size);
};
