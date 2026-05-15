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

  code: [
    '$title[🔨 Member Banned]',
    '$color[ED4245]',
    '$description[**$get[bannedUsername]** (`$get[bannedUserID]`) was banned from **$get[guildName]**.]',
    '$addField[Reason;$get[banReason];false]',
    '$footer[onBanAdd ✓ — CenzoJS]',
    '$timestamp',
  ].join('\n'),
};
