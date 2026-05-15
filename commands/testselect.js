'use strict';

/**
 * Select menu handler for "testselect".
 * Fires when a user picks an option from the dropdown in /testinteraction.
 * $commandArgs[0] contains the selected value (ping / info / stats / random / time).
 */
module.exports = {
  name:      'testselect',
  type:      'selectmenu',
  customID:  'testselect',
  ephemeral: true,

  code: [
    '$title[📋 Select Menu — $commandArgs[0]]',
    '$color[EB459E]',
    '$description[You selected: **$commandArgs[0]**]',
    '$addField[🎯 Selected value;`$commandArgs[0]`;true]',
    '$addField[👤 Selected by;<@$authorID>;true]',
    '$addField[📢 Channel;<#$channelID>;true]',
    '$addField[⏰ Time;$time[HH:mm:ss];true]',
    '$addField[🏓 Bot Latency;$ping ms;true]',
    '$addField[👥 Member Count;$memberCount;true]',
    '$footer[Select menu interactions ✓ — CenzoJS v2.0]',
    '$timestamp',
  ].join('\n'),
};
