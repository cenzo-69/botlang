'use strict';

/**
 * onRoleUpdate — fires when a role is edited (name, color, permissions, etc.)
 *
 * Available via $get[varName] in your code:
 *   roleID        → the role's ID
 *   oldRoleName   → name before the update
 *   newRoleName   → name after the update
 *   oldRoleColor  → hex color before
 *   newRoleColor  → hex color after
 *   guildName     → server name
 */
module.exports = {
  name: 'onRoleUpdate',

  // Uncomment and edit to activate:
  // code: `$if[$get[oldRoleName]!=$get[newRoleName];true]
  // ✏️ Role renamed from **$get[oldRoleName]** to **$get[newRoleName]**
  // $endif`,
};
