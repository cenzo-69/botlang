'use strict';

/**
 * onEmojiCreate — fires when a custom emoji is added to a guild.
 *
 * Available via $getVar[varName] in your code:
 *   emojiID       → emoji snowflake ID
 *   emojiName     → emoji name (without colons)
 *   emojiAnimated → "true" if the emoji is animated
 *   emojiURL      → direct CDN URL of the emoji image
 *   guildName     → guild name
 */
module.exports = {
  name: 'onEmojiCreate',

  // Uncomment and edit to activate:
  // code: `
  //   $title[✨ New Emoji Added]
  //   $color[FEE75C]
  //   $addField[Name;:$getVar[emojiName]:;true]
  //   $addField[Animated;$getVar[emojiAnimated];true]
  //   $thumbnail[$getVar[emojiURL]]
  // `,
};
