'use strict';

/**
 * onThreadDelete — fires when a thread is deleted in a guild.
 *
 * Available via $get[]:
 *   threadID          — the deleted thread's ID
 *   threadName        — thread name
 *   parentChannelID   — the parent channel ID
 *   parentChannelName — the parent channel name
 *   guildName         — guild name
 *
 * Uncomment `code:` below to activate this event:
 */
module.exports = {
  name: 'onThreadDelete',

  // code: [
  //   '🗑️ Thread **$get[threadName]** was deleted from <#$get[parentChannelID]>.',
  // ].join('\n'),
};
