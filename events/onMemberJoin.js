'use strict';

/**
 * onMemberJoin — fires when a new member joins the server.
 *
 * Available via $getVar[varName] in your code:
 *   memberID       → the new member's user ID
 *   memberTag      → User#0000
 *   memberUsername → plain username
 *   memberAvatar   → avatar URL
 *   memberCount    → total server member count after join
 *   guildName      → server name
 */
module.exports = {
  name: 'onMemberJoin',

  code: `
    $title[👋 New Member!]
    $color[57F287]
    $thumbnail[$getVar[memberAvatar]]
    $description[Welcome to **$getVar[guildName]**, <@$getVar[memberID]>! 🎉]
    $addField[Username;$getVar[memberUsername];true]
    $addField[Member Count;#$getVar[memberCount];true]
    $footer[onMemberJoin ✓ — CenzoJS]
    $timestamp
  `,
};
