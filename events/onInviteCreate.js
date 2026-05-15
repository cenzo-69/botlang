'use strict';

/**
 * onInviteCreate — fires when a guild invite is created.
 *
 * Available via $getVar[varName] in your code:
 *   inviteCode      → the invite code
 *   inviterID       → ID of the user who created the invite
 *   inviterTag      → username#discriminator of the creator
 *   inviterUsername → username of the creator
 *   channelID       → the channel the invite leads to
 *   maxUses         → maximum uses (0 = unlimited)
 *   guildName       → guild name
 */
module.exports = {
  name: 'onInviteCreate',

  // Uncomment and edit to activate:
  // code: `
  //   $title[✉️ Invite Created]
  //   $color[57F287]
  //   $addField[Code;discord.gg/$getVar[inviteCode];true]
  //   $addField[Created by;<@$getVar[inviterID]>;true]
  //   $addField[Channel;<#$getVar[channelID]>;true]
  //   $addField[Max Uses;$getVar[maxUses];true]
  // `,
};
