'use strict';

module.exports = {
  name: 'onMemberUpdate',

  code: [
    '$if[$getVar[oldNickname]==$getVar[newNickname]]',
    '$stop',
    '$endif',
    '$title[✏️ Nickname Changed]',
    '$color[FEE75C]',
    '$description[<@$getVar[memberID]> updated their nickname in **$getVar[guildName]**.]',
    '$addField[Before;$default[$getVar[oldNickname];*(none)*];true]',
    '$addField[After;$default[$getVar[newNickname];*(none)*];true]',
    '$addField[🆔 User ID;`$getVar[memberID]`;false]',
    '$footer[onMemberUpdate · CenzoJS]',
    '$timestamp',
  ].join('\n'),
};
