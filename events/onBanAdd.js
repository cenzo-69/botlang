'use strict';

module.exports = {
  name: 'onBanAdd',

  code: [
    '$title[🔨 Member Banned]',
    '$color[ED4245]',
    '$description[**$getVar[bannedUsername]** has been banned from **$getVar[guildName]**.]',
    '$addField[👤 Username;$getVar[bannedUsername];true]',
    '$addField[🏷️ Tag;$getVar[bannedUserTag];true]',
    '$addField[🆔 User ID;`$getVar[bannedUserID]`;false]',
    '$addField[📋 Reason;$default[$getVar[banReason];No reason provided];false]',
    '$footer[Ban · CenzoJS]',
    '$timestamp',
  ].join('\n'),
};
