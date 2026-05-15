'use strict';

module.exports = {
  name: 'onReactionRemove',

  code: [
    '$title[❌ Reaction Removed]',
    '$color[ED4245]',
    '$description[<@$getVar[reactorID]> removed their **$getVar[reactionEmoji]** reaction from a message by <@$getVar[reactedAuthorID]>.]',
    '$addField[👤 Reactor;$getVar[reactorUsername];true]',
    '$addField[😀 Emoji;$getVar[reactionEmoji];true]',
    '$addField[🔢 Remaining;$getVar[reactionCount];true]',
    '$footer[Reaction removed · CenzoJS]',
    '$timestamp',
  ].join('\n'),
};
