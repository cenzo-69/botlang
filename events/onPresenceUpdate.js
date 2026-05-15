'use strict';

/**
 * onPresenceUpdate — fires when a user's presence (status / activity) changes.
 *
 * Available via $get[]:
 *   memberID        — user snowflake ID
 *   memberUsername  — username
 *   memberTag       — username#discriminator
 *   oldStatus       — previous status (online/idle/dnd/offline)
 *   newStatus       — new status
 *   guildName       — guild name
 *
 * Uncomment `code:` below to activate this event:
 */
module.exports = {
  name: 'onPresenceUpdate',

  // code: [
  //   '$onlyIf[$notEquals[$get[oldStatus];$get[newStatus]];]',
  //   '$sendMessage[$channelID;📡 **$get[memberUsername]** changed status: `$get[oldStatus]` → `$get[newStatus]`]',
  // ].join('\n'),
};
