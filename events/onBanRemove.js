'use strict';

module.exports = {
  name: 'onBanRemove',

  code: [
    '$title[✅ Member Unbanned]',
    '$color[57F287]',
    '$description[**$getVar[bannedUsername]** has been unbanned from **$getVar[guildName]**.]',
    '$addField[👤 Username;$getVar[bannedUsername];true]',
    '$addField[🏷️ Tag;$getVar[bannedUserTag];true]',
    '$addField[🆔 User ID;`$getVar[bannedUserID]`;false]',
    '$footer[Unban · CenzoJS]',
    '$timestamp',
  ].join('\n'),
};
