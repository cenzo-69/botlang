'use strict';

module.exports = {
  name: 'onRoleDelete',

  code: [
    '$title[🗑️ Role Deleted]',
    '$color[ED4245]',
    '$description[Role **$getVar[roleName]** was deleted from **$getVar[guildName]**.]',
    '$addField[🎭 Role Name;$getVar[roleName];true]',
    '$addField[🎨 Color;$getVar[roleColor];true]',
    '$addField[🔔 Was Mentionable;$getVar[roleMentionable];true]',
    '$addField[🆔 Role ID;`$getVar[roleID]`;false]',
    '$footer[Role deleted · CenzoJS]',
    '$timestamp',
  ].join('\n'),
};
