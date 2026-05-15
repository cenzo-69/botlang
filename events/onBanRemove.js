'use strict';

/**
 * onBanRemove — fires when a member is unbanned from the server.
 *
 * Available via $getVar[varName] in your code:
 *   bannedUserID   → the unbanned user's ID
 *   bannedUserTag  → User#0000
 *   bannedUsername → plain username
 *   banReason      → the original ban reason (or "No reason provided")
 *   guildName      → server name
 */
module.exports = {
  name: 'onBanRemove',

  // Uncomment and edit to activate:
  // code: `✅ **$getVar[bannedUserTag]** has been unbanned from **$getVar[guildName]**.`,
};
