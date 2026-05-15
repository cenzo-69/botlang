'use strict';

/**
 * onRoleDelete — fires when a role is deleted from the server.
 *
 * Available via $get[varName] in your code:
 *   roleID          → the deleted role's ID
 *   roleName        → the role's name
 *   roleColor       → hex color
 *   rolePosition    → position it had
 *   roleMentionable → "true" or "false"
 *   guildName       → server name
 */
module.exports = {
  name: 'onRoleDelete',

  // Uncomment and edit to activate:
  // code: `🗑️ Role **$get[roleName]** was deleted from **$get[guildName]**.`,
};
