'use strict';

/**
 * onMemberUpdate — fires when a member's profile changes (roles, nickname, timeout, etc.)
 *
 * Available via $get[varName] in your code:
 *   memberID       → the member's user ID
 *   memberTag      → User#0000
 *   memberUsername → plain username
 *   oldNickname    → nickname before the change (empty if none)
 *   newNickname    → nickname after the change (empty if none)
 *   guildName      → server name
 */
module.exports = {
  name: 'onMemberUpdate',

  // Uncomment and edit to activate:
  // code: `$if[$get[oldNickname]!=$get[newNickname];true]
  // <@$get[memberID]> changed their nickname from **$get[oldNickname]** to **$get[newNickname]**
  // $endif`,
};
