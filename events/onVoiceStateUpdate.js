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

  code: [
    '$title[$if[$get[voiceAction]==joined;🔊 Joined Voice;$if[$get[voiceAction]==left;🔇 Left Voice;🔀 Moved Voice]]]',
    '$color[$if[$get[voiceAction]==joined;57F287;$if[$get[voiceAction]==left;ED4245;FEE75C]]]',
    '$description[<@$get[memberID]> ($get[memberUsername]) $if[$get[voiceAction]==joined;joined **$get[newChannelName]**;$if[$get[voiceAction]==left;left **$get[oldChannelName]**;moved from **$get[oldChannelName]** → **$get[newChannelName]**]]]',
    '$addField[Server;$get[guildName];true]',
    '$addField[Action;$get[voiceAction];true]',
    '$footer[onVoiceStateUpdate ✓ — CenzoJS]',
    '$timestamp',
  ].join('\n'),
};
