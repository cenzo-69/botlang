'use strict';

/**
 * onEmojiUpdate — fires when a custom emoji is renamed in a guild.
 *
 * Available via $getVar[varName] in your code:
 *   emojiID       → emoji snowflake ID
 *   oldEmojiName  → name before the rename
 *   newEmojiName  → name after the rename
 *   emojiAnimated → "true" if the emoji is animated
 *   emojiURL      → direct CDN URL of the emoji image
 *   guildName     → guild name
 */
module.exports = {
  name: 'onEmojiUpdate',

  // Uncomment and edit to activate:
  // code: `
  //   $if[$getVar[oldEmojiName]!=$getVar[newEmojiName]]
  //   ✏️ Emoji renamed from :$getVar[oldEmojiName]: to :$getVar[newEmojiName]:
  //   $endif
  // `,
};
