'use strict';

module.exports = {
  name:      'testchannelselect',
  type:      'selectmenu',
  customID:  'testchannelselect',
  ephemeral: true,

  code: `
$title[📢 Channel Picked!]
$color[57F287]
$description[You selected a channel using the **Channel Select** menu:]
$addField[Selected Channel; <#$commandArgs[0]>;    true]
$addField[Channel ID;       \`$commandArgs[0]\`; true]
$addField[Picked by;        <@$authorID>;           true]
$footer[Channel select menu ✓ — CenzoJS]
$timestamp
  `,
};
