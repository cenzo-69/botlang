'use strict';

module.exports = {
  name: 'onChannelDelete',

  code: [
    '$title[🗑️ Channel Deleted]',
    '$color[ED4245]',
    '$description[Channel **#$getVar[channelName]** was deleted from **$getVar[guildName]**.]',
    '$addField[📌 Channel Name;$getVar[channelName];true]',
    '$addField[🔢 Type;$getVar[channelType];true]',
    '$addField[🆔 Channel ID;`$getVar[channelID]`;false]',
    '$footer[Channel deleted · CenzoJS]',
    '$timestamp',
  ].join('\n'),
};
