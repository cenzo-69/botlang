'use strict';

module.exports = {
  name: 'onRoleUpdate',

  code: [
    '$if[$getVar[oldRoleName]==$getVar[newRoleName]]',
    '$if[$getVar[oldRoleColor]==$getVar[newRoleColor]]',
    '$stop',
    '$endif',
    '$endif',
    '$title[✏️ Role Updated]',
    '$color[$getVar[newRoleColor]]',
    '$description[Role **$getVar[oldRoleName]** was updated in **$getVar[guildName]**.]',
    '$addField[Name Before;$getVar[oldRoleName];true]',
    '$addField[Name After;$getVar[newRoleName];true]',
    '$addField[Color Before;$getVar[oldRoleColor];true]',
    '$addField[Color After;$getVar[newRoleColor];true]',
    '$addField[🆔 Role ID;`$getVar[roleID]`;false]',
    '$footer[Role updated · CenzoJS]',
    '$timestamp',
  ].join('\n'),
};
