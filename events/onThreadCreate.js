'use strict';

/**
 * onThreadCreate — fires when a thread is created in a guild.
 *
 * Available via $get[]:
 *   threadID          — the new thread's ID
 *   threadName        — thread name
 *   threadType        — thread type integer
 *   parentChannelID   — the parent channel ID
 *   parentChannelName — the parent channel name
 *   memberCount       — initial member count
 *   guildName         — guild name
 *
 * Uncomment `code:` below to activate this event:
 */
module.exports = {
  name: 'onThreadCreate',

  // code: [
  //   '$title[🧵 New Thread Created]',
  //   '$color[3498DB]',
  //   '$addField[Thread;<#$get[threadID]>;true]',
  //   '$addField[Parent;<#$get[parentChannelID]>;true]',
  //   '$addField[Server;$get[guildName];true]',
  //   '$sendEmbed[$get[parentChannelID]]',
  // ].join('\n'),
};
