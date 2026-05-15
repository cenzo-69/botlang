'use strict';

module.exports = {
  name: 'onRoleCreate',

  code: [
    '$title[🎭 Role Created]',
    '$color[EB459E]',
    '$description[Role **$getVar[roleName]** was created in **$getVar[guildName]**.]',
    '$addField[🎭 Role;<@&$getVar[roleID]>;true]',
    '$addField[🎨 Color;$getVar[roleColor];true]',
    '$addField[🔔 Mentionable;$getVar[roleMentionable];true]',
    '$addField[📊 Position;$getVar[rolePosition];true]',
    '$addField[🆔 Role ID;`$getVar[roleID]`;false]',
    '$footer[Role created · CenzoJS]',
    '$timestamp',
  ].join('\n'),
};
