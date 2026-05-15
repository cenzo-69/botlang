'use strict';

/**
 * onVoiceStateUpdate — fires when a member joins, leaves, or moves between voice channels.
 *
 * Available via $get[varName] in your code:
 *   memberID       → the member's user ID
 *   memberTag      → User#0000
 *   memberUsername → plain username
 *   oldChannelID   → channel they were in (empty if they just joined)
 *   newChannelID   → channel they moved to (empty if they just left)
 *   oldChannelName → name of the old channel
 *   newChannelName → name of the new channel
 *   voiceAction    → "joined", "left", or "moved"
 *   guildName      → server name
 */
module.exports = {
  name: 'onVoiceStateUpdate',

  // Uncomment and edit to activate:
  // code: `$if[$get[voiceAction]==joined;true]
  // 🔊 <@$get[memberID]> joined **$get[newChannelName]**
  // $elseif[$get[voiceAction]==left]
  // 🔇 <@$get[memberID]> left **$get[oldChannelName]**
  // $elseif[$get[voiceAction]==moved]
  // 🔀 <@$get[memberID]> moved from **$get[oldChannelName]** to **$get[newChannelName]**
  // $endif`,
};
