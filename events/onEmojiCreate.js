'use strict';

/**
 * onEmojiCreate — fires when a custom emoji is added to a guild.
 *
 * Available via $get[]:
 *   emojiID       — emoji snowflake ID
 *   emojiName     — emoji name (without colons)
 *   emojiAnimated — "true" if the emoji is animated
 *   emojiURL      — direct CDN URL of the emoji image
 *   guildName     — guild name
 *
 * Uncomment `code:` below to activate this event:
 */
module.exports = {
  name: 'onEmojiCreate',

  // code: [
  //   '$title[✨ New Emoji Added]',
  //   '$color[FEE75C]',
  //   '$addField[Name;:$get[emojiName]:<$get[emojiID]>;true]',
  //   '$addField[Animated;$get[emojiAnimated];true]',
  //   '$thumbnail[$get[emojiURL]]',
  //   '$sendEmbed[$channelID]',
  // ].join('\n'),
};
