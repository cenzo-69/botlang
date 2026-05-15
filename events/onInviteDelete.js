'use strict';

/**
 * onInviteDelete — fires when a guild invite is deleted.
 *
 * Available via $get[]:
 *   inviteCode  — the deleted invite code
 *   channelID   — the channel the invite was for
 *   guildName   — guild name
 *
 * Uncomment `code:` below to activate this event:
 */
module.exports = {
  name: 'onInviteDelete',

  // code: [
  //   '🗑️ Invite `discord.gg/$get[inviteCode]` has been deleted.',
  // ].join('\n'),
};
