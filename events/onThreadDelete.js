'use strict';

/**
 * onThreadDelete — fires when a thread is deleted in a guild.
 *
 * Available via $getVar[varName] in your code:
 *   threadID          → the deleted thread's ID
 *   threadName        → thread name
 *   parentChannelID   → the parent channel ID
 *   parentChannelName → the parent channel name
 *   guildName         → guild name
 */
module.exports = {
  name: 'onThreadDelete',

  // Uncomment and edit to activate:
  // code: `🗑️ Thread **$getVar[threadName]** was deleted from <#$getVar[parentChannelID]>.`,
};
