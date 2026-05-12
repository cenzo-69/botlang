'use strict';
// $deleteChannelCooldown[channelID?]  — removes a channel's cooldown
module.exports = async (context, args) => {
  const channelID = String(args[0] !== undefined ? args[0] : '').trim() || context.message?.channelId || 'unknown';
  context.variables.delete(`__cd_channel_${channelID}__`);
  return '';
};
