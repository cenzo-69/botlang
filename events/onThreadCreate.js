'use strict';

/**
 * onThreadCreate — fires when a thread is created in a guild.
 *
 * Available via $getVar[varName] in your code:
 *   threadID          → the new thread's ID
 *   threadName        → thread name
 *   threadType        → thread type integer
 *   parentChannelID   → the parent channel ID
 *   parentChannelName → the parent channel name
 *   memberCount       → initial member count
 *   guildName         → guild name
 */
module.exports = {
  name: 'onThreadCreate',

  // Uncomment and edit to activate:
  // code: `
  //   $title[🧵 New Thread Created]
  //   $color[3498DB]
  //   $addField[Thread;<#$getVar[threadID]>;true]
  //   $addField[Parent;<#$getVar[parentChannelID]>;true]
  //   $addField[Server;$getVar[guildName];true]
  // `,
};
