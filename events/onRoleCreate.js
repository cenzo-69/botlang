'use strict';

/**
 * onRoleCreate — fires when a new role is created in the server.
 *
 * Available via $getVar[varName] in your code:
 *   roleID          → the new role's ID
 *   roleName        → the role's name
 *   roleColor       → hex color (e.g. "#FF0000" or "#000000")
 *   rolePosition    → position in the role list
 *   roleMentionable → "true" or "false"
 *   guildName       → server name
 */
module.exports = {
  name: 'onRoleCreate',

  code: `
    $title[🎭 New Role Created]
    $color[EB459E]
    $description[Role **$getVar[roleName]** was created in **$getVar[guildName]**.]
    $addField[Role ID;\`$getVar[roleID]\`;true]
    $addField[Color;$getVar[roleColor];true]
    $addField[Mentionable;$getVar[roleMentionable];true]
    $footer[onRoleCreate ✓ — CenzoJS]
    $timestamp
  `,
};
