'use strict';

// $randomChannelID  — random channel ID from the current guild cache
module.exports = async (context, args) => {
  if (!context.message?.guild) return '[error: no guild]';
  const channels = [...context.message.guild.channels.cache.values()];
  if (!channels.length) return '[error: empty channel cache]';
  return channels[Math.floor(Math.random() * channels.length)].id;
};
