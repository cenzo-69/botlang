'use strict';

/**
 * onBanAdd — fires when a member is banned from the server.
 *
 * Available via $get[varName] in your code:
 *   bannedUserID   → the banned user's ID
 *   bannedUserTag  → User#0000
 *   bannedUsername → plain username
 *   banReason      → ban reason (or "No reason provided")
 *   guildName      → server name
 *
 * Note: The context channel is the server's system channel.
 */
module.exports = {
  name: 'onBanAdd',

  // Uncomment and edit to activate:
  // code: `🔨 **$get[bannedUserTag]** was banned from **$get[guildName]**.\nReason: $get[banReason]`,
};
