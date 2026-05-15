'use strict';

/**
 * onMemberJoin — fires when a new member joins the server.
 *
 * Available via $get[varName] in your code:
 *   memberID       → the new member's user ID
 *   memberTag      → User#0000
 *   memberUsername → plain username
 *   memberAvatar   → avatar URL
 *   memberCount    → total server member count after join
 *   guildName      → server name
 *
 * The context also has $guildID, $channelID (system channel), $authorID (the new member).
 */
module.exports = {
  name: 'onMemberJoin',

  // Uncomment and edit to activate:
  // code: `Welcome <@$get[memberID]> to **$get[guildName]**! You are member #$get[memberCount].`,
};
