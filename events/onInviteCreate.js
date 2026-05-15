'use strict';

/**
 * onInviteCreate — fires when a guild invite is created.
 *
 * Available via $get[]:
 *   inviteCode    — the invite code
 *   inviterID     — ID of the user who created the invite
 *   inviterTag    — username#discriminator of the creator
 *   inviterUsername — username of the creator
 *   channelID     — the channel the invite leads to
 *   maxUses       — maximum uses (0 = unlimited)
 *   guildName     — guild name
 *
 * Uncomment `code:` below to activate this event:
 */
module.exports = {
  name: 'onInviteCreate',

  // code: [
  //   '$title[✉️ Invite Created]',
  //   '$color[57F287]',
  //   '$addField[Code;discord.gg/$get[inviteCode];true]',
  //   '$addField[Created by;<@$get[inviterID]>;true]',
  //   '$addField[Channel;<#$get[channelID]>;true]',
  //   '$addField[Max Uses;$get[maxUses];true]',
  //   '$sendEmbed[$channelID]',
  // ].join('\n'),
};
