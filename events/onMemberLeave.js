'use strict';

/**
 * onMemberLeave — fires when a member leaves (or is kicked from) the server.
 *
 * Available via $get[varName] in your code:
 *   memberID       → the member's user ID
 *   memberTag      → User#0000
 *   memberUsername → plain username
 *   memberAvatar   → avatar URL
 *   memberCount    → total server member count after they left
 *   guildName      → server name
 */
module.exports = {
  name: 'onMemberLeave',

  code: [
    '$title[🚪 Member Left]',
    '$color[ED4245]',
    '$description[**$get[memberUsername]** has left **$get[guildName]**. Goodbye!]',
    '$addField[Members remaining;$get[memberCount];true]',
    '$footer[onMemberLeave ✓ — CenzoJS]',
    '$timestamp',
  ].join('\n'),
};
