'use strict';

/**
 * onChannelUpdate — fires when a channel is modified (name, topic, permissions, etc.)
 *
 * Available via $get[varName] in your code:
 *   channelID      → the channel's ID
 *   oldChannelName → name before the update
 *   newChannelName → name after the update
 *   channelType    → Discord channel type number
 *   guildName      → server name
 */
module.exports = {
  name: 'onChannelUpdate',

  // Uncomment and edit to activate:
  // code: `$if[$get[oldChannelName]!=$get[newChannelName];true]
  // ✏️ Channel renamed from **#$get[oldChannelName]** to **#$get[newChannelName]**
  // $endif`,
};
