'use strict';

module.exports = {
  name: 'onReactionAdd',

  code: [
    '$title[⭐ Reaction Added]',
    '$color[FEE75C]',
    '$description[<@$getVar[reactorID]> reacted with **$getVar[reactionEmoji]** on a message by <@$getVar[reactedAuthorID]>.]',
    '$addField[👤 Reactor;$getVar[reactorUsername];true]',
    '$addField[😀 Emoji;$getVar[reactionEmoji];true]',
    '$addField[🔢 Count;$getVar[reactionCount];true]',
    '$addField[📌 Channel;<#$getVar[reactedChannelID]>;false]',
    '$footer[Reaction added · CenzoJS]',
    '$timestamp',
  ].join('\n'),
};
