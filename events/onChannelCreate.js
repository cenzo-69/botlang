'use strict';

/**
 * onChannelCreate — fires when a channel is created in the server.
 *
 * Available via $getVar[varName] in your code:
 *   channelID   → the new channel's ID
 *   channelName → the channel's name
 *   channelType → Discord channel type number (0=text, 2=voice, 4=category, etc.)
 *   guildName   → server name
 */
module.exports = {
  name: 'onChannelCreate',

  code: `
    $title[📢 New Channel Created]
    $color[57F287]
    $description[Channel **#$getVar[channelName]** was created in **$getVar[guildName]**.]
    $addField[Channel;<#$getVar[channelID]>;true]
    $addField[Type;$getVar[channelType];true]
    $footer[onChannelCreate ✓ — CenzoJS]
    $timestamp
  `,
};
