'use strict';

/**
 * onBanAdd — fires when a member is banned from the server.
 *
 * Available via $getVar[varName] in your code:
 *   bannedUserID   → the banned user's ID
 *   bannedUserTag  → User#0000
 *   bannedUsername → plain username
 *   banReason      → ban reason (or "No reason provided")
 *   guildName      → server name
 */
module.exports = {
  name: 'onBanAdd',

  code: `
    $title[🔨 Member Banned]
    $color[ED4245]
    $description[**$getVar[bannedUsername]** (\`$getVar[bannedUserID]\`) was banned from **$getVar[guildName]**.]
    $addField[Reason;$getVar[banReason];false]
    $footer[onBanAdd ✓ — CenzoJS]
    $timestamp
  `,
};
