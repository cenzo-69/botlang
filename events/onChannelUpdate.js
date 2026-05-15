'use strict';

module.exports = {
  name: 'onChannelUpdate',

  code: [
    '$if[$getVar[oldChannelName]==$getVar[newChannelName]]',
    '$stop',
    '$endif',
    '$title[✏️ Channel Renamed]',
    '$color[FEE75C]',
    '$description[A channel was renamed in **$getVar[guildName]**.]',
    '$addField[Before;#$getVar[oldChannelName];true]',
    '$addField[After;<#$getVar[channelID]>;true]',
    '$addField[🆔 Channel ID;`$getVar[channelID]`;false]',
    '$footer[Channel updated · CenzoJS]',
    '$timestamp',
  ].join('\n'),
};
