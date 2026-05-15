'use strict';

module.exports = {
  name: 'onInviteDelete',

  code: [
    '$title[🗑️ Invite Deleted]',
    '$color[ED4245]',
    '$description[Invite `discord.gg/$getVar[inviteCode]` was deleted in **$getVar[guildName]**.]',
    '$addField[🔗 Code;$getVar[inviteCode];true]',
    '$addField[📌 Channel;<#$getVar[channelID]>;true]',
    '$footer[Invite deleted · CenzoJS]',
    '$timestamp',
  ].join('\n'),
};
