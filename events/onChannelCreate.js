'use strict';

module.exports = {
  name: 'onChannelCreate',

  code: [
    '$title[📢 Channel Created]',
    '$color[57F287]',
    '$description[Channel **#$getVar[channelName]** was created in **$getVar[guildName]**.]',
    '$addField[📌 Channel;<#$getVar[channelID]>;true]',
    '$addField[🔢 Type;$getVar[channelType];true]',
    '$addField[🆔 Channel ID;`$getVar[channelID]`;false]',
    '$footer[Channel created · CenzoJS]',
    '$timestamp',
  ].join('\n'),
};
