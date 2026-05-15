'use strict';

/**
 * onVoiceStateUpdate — fires when a member joins, leaves, or moves between voice channels.
 *
 * Available via $getVar[varName] in your code:
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

  code: `
    $title[$if[$getVar[voiceAction]==joined;🔊 Joined Voice;$if[$getVar[voiceAction]==left;🔇 Left Voice;🔀 Moved Voice]]]
    $color[$if[$getVar[voiceAction]==joined;57F287;$if[$getVar[voiceAction]==left;ED4245;FEE75C]]]
    $description[<@$getVar[memberID]> ($getVar[memberUsername]) $if[$getVar[voiceAction]==joined;joined **$getVar[newChannelName]**;$if[$getVar[voiceAction]==left;left **$getVar[oldChannelName]**;moved from **$getVar[oldChannelName]** → **$getVar[newChannelName]**]]]
    $addField[Server;$getVar[guildName];true]
    $addField[Action;$getVar[voiceAction];true]
    $footer[onVoiceStateUpdate ✓ — CenzoJS]
    $timestamp
  `,
};
