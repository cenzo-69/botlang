'use strict';

/**
 * onMemberUpdate — fires when a member's profile changes (roles, nickname, timeout, etc.)
 *
 * Available via $getVar[varName] in your code:
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
  // code: `
  //   $if[$getVar[oldNickname]!=$getVar[newNickname]]
  //   <@$getVar[memberID]> changed their nickname from **$getVar[oldNickname]** to **$getVar[newNickname]**
  //   $endif
  // `,
};
