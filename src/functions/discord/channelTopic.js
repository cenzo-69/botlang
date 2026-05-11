'use strict';

// $channelTopic  — the current channel's topic (empty if not set)
module.exports = async (context, args) => {
  if (!context.message?.channel) return '[error: no channel]';
  return context.message.channel.topic || '';
};
