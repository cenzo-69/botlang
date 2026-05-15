'use strict';

/**
 * onInviteDelete — fires when a guild invite is deleted.
 *
 * Available via $getVar[varName] in your code:
 *   inviteCode  → the deleted invite code
 *   channelID   → the channel the invite was for
 *   guildName   → guild name
 */
module.exports = {
  name: 'onInviteDelete',

  // Uncomment and edit to activate:
  // code: `🗑️ Invite \`discord.gg/$getVar[inviteCode]\` has been deleted.`,
};
