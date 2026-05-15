'use strict';

/**
 * onChannelDelete — fires when a channel is deleted from the server.
 *
 * Available via $getVar[varName] in your code:
 *   channelID   → the deleted channel's ID
 *   channelName → the channel's name
 *   channelType → Discord channel type number
 *   guildName   → server name
 */
module.exports = {
  name: 'onChannelDelete',

  // Uncomment and edit to activate:
  // code: `🗑️ Channel **#$getVar[channelName]** was deleted from **$getVar[guildName]**.`,
};
