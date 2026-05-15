'use strict';

/**
 * onRoleCreate — fires when a new role is created in the server.
 *
 * Available via $get[varName] in your code:
 *   roleID          → the new role's ID
 *   roleName        → the role's name
 *   roleColor       → hex color (e.g. "#FF0000" or "#000000")
 *   rolePosition    → position in the role list
 *   roleMentionable → "true" or "false"
 *   guildName       → server name
 */
module.exports = {
  name: 'onRoleCreate',

  code: [
    '$title[🎭 New Role Created]',
    '$color[EB459E]',
    '$description[Role **$get[roleName]** was created in **$get[guildName]**.]',
    '$addField[Role ID;`$get[roleID]`;true]',
    '$addField[Color;$get[roleColor];true]',
    '$addField[Mentionable;$get[roleMentionable];true]',
    '$footer[onRoleCreate ✓ — CenzoJS]',
    '$timestamp',
  ].join('\n'),
};
