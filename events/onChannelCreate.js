'use strict';

/**
 * onChannelCreate — fires when a channel is created in the server.
 *
 * Available via $get[varName] in your code:
 *   channelID   → the new channel's ID
 *   channelName → the channel's name
 *   channelType → Discord channel type number (0=text, 2=voice, 4=category, etc.)
 *   guildName   → server name
 */
module.exports = {
  name: 'onChannelCreate',

  // Uncomment and edit to activate:
  // code: `📢 New channel **#$get[channelName]** was created in **$get[guildName]**.`,
};
