'use strict';

module.exports = {
  name: 'onEmojiUpdate',

  code: [
    '$if[$getVar[oldEmojiName]==$getVar[newEmojiName]]',
    '$stop',
    '$endif',
    '$title[✏️ Emoji Renamed]',
    '$color[FEE75C]',
    '$description[An emoji was renamed in **$getVar[guildName]**.]',
    '$addField[Before;:$getVar[oldEmojiName]:;true]',
    '$addField[After;:$getVar[newEmojiName]:;true]',
    '$addField[🆔 Emoji ID;`$getVar[emojiID]`;false]',
    '$footer[Emoji updated · CenzoJS]',
    '$timestamp',
  ].join('\n'),
};
