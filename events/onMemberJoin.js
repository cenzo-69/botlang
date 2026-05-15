'use strict';

module.exports = {
  name: 'onMemberJoin',

  code: [
    '$title[👋 Welcome to $getVar[guildName]!]',
    '$color[57F287]',
    '$thumbnail[$getVar[memberAvatar]]',
    '$description[Hey <@$getVar[memberID]>, welcome aboard! 🎉$newlineMake sure to read the rules and enjoy your stay!]',
    '$addField[👤 Username;$getVar[memberUsername];true]',
    '$addField[🏷️ Tag;$getVar[memberTag];true]',
    '$addField[👥 Member Count;#$getVar[memberCount];true]',
    '$addField[🆔 User ID;`$getVar[memberID]`;false]',
    '$footer[Welcome to the server! · CenzoJS]',
    '$timestamp',
  ].join('\n'),
};
