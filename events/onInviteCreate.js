'use strict';

module.exports = {
  name: 'onInviteCreate',

  code: [
    '$title[✉️ Invite Created]',
    '$color[57F287]',
    '$description[A new invite was created for **$getVar[guildName]**.]',
    '$addField[🔗 Code;discord.gg/$getVar[inviteCode];true]',
    '$addField[👤 Created by;<@$getVar[inviterID]>;true]',
    '$addField[📌 Channel;<#$getVar[channelID]>;true]',
    '$addField[🔢 Max Uses;$default[$getVar[maxUses];Unlimited];true]',
    '$footer[Invite created · CenzoJS]',
    '$timestamp',
  ].join('\n'),
};
