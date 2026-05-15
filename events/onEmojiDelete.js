'use strict';

module.exports = {
  name: 'onEmojiDelete',

  code: [
    '$title[🗑️ Emoji Deleted]',
    '$color[ED4245]',
    '$description[Emoji **:$getVar[emojiName]:** was removed from **$getVar[guildName]**.]',
    '$addField[Name;:$getVar[emojiName]:;true]',
    '$addField[Animated;$getVar[emojiAnimated];true]',
    '$addField[🆔 Emoji ID;`$getVar[emojiID]`;false]',
    '$footer[Emoji deleted · CenzoJS]',
    '$timestamp',
  ].join('\n'),
};
