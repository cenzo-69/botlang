'use strict';

module.exports = {
  name:      'testselect',
  type:      'selectmenu',
  customID:  'testselect',
  ephemeral: true,

  code: `
$title[📋 Select Menu — $commandArgs[0]]
$color[EB459E]
$description[You selected: **$commandArgs[0]**]
$addField[🎯 Selected value; \`$commandArgs[0]\`; true]
$addField[👤 Selected by;    <@$authorID>;         true]
$addField[📢 Channel;        <#$channelID>;         true]
$addField[⏰ Time;            $time[HH:mm:ss];      true]
$addField[🏓 Bot Latency;    $ping ms;              true]
$addField[👥 Member Count;   $memberCount;          true]
$footer[Select menu interactions ✓ — CenzoJS]
$timestamp
  `,
};
