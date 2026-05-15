'use strict';

/**
 * onEmojiDelete — fires when a custom emoji is removed from a guild.
 *
 * Available via $getVar[varName] in your code:
 *   emojiID       → emoji snowflake ID
 *   emojiName     → emoji name (without colons)
 *   emojiAnimated → "true" if the emoji is animated
 *   emojiURL      → direct CDN URL of the emoji image
 *   guildName     → guild name
 */
module.exports = {
  name: 'onEmojiDelete',

  // Uncomment and edit to activate:
  // code: `
  //   $title[🗑️ Emoji Deleted]
  //   $color[ED4245]
  //   $addField[Name;:$getVar[emojiName]:;true]
  //   $addField[Animated;$getVar[emojiAnimated];true]
  //   $addField[ID;$getVar[emojiID];true]
  // `,
};
