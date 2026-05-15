'use strict';

/**
 * Select menu handler for the channel select in /testinteraction.
 * customID: testchannelselect
 * $commandArgs[0] contains the selected channel's ID.
 */
module.exports = {
  name:      'testchannelselect',
  type:      'selectmenu',
  customID:  'testchannelselect',
  ephemeral: true,

  code: [
    '$title[📢 Channel Picked!]',
    '$color[57F287]',
    '$description[You selected a channel using the **Channel Select** menu:]',

    '$addField[Selected Channel;<#$commandArgs[0]>;true]',
    '$addField[Channel ID;`$commandArgs[0]`;true]',
    '$addField[Picked by;<@$authorID>;true]',

    '$footer[Channel select menu ✓ — CenzoJS]',
    '$timestamp',
  ].join('\n'),
};
